import { cartModel } from '../methods/mongo/classes/carts.dao.js';
import ProductService from './products.service.js';
// import TicketService from './tickets.service.js';
import Errors from '../errors/enums.js';
import logger from '../config/utils/logger.js';
import CustomError from '../errors/custom-error.js';
import { idValidation } from '../config/mongo.js';


// Se utilizara el manejo del Cache al nivel de la capa de servicios para evitar la sobrecarga de la base de datos.
// Se podria implementar un sistema de cacheo de productos y otros objetos de forma global y no en servicios para mejorar estructura.
 // Se podria hacer mas escalable si se implementa un sistema de cacheo de productos y otros objetos de forma global y no en servicios.

const productService = new ProductService();
// const ticketService = new TicketService;

export class CartService {
    async getAll() {
        try {
            const carts = await cartModel.find();
            return carts;
        } catch (error) {
            logger.error({ error, errorMsg: error.message });
            throw CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error retrieving carts.',
                code: Errors.NO_CART,
            });
        }
    }

    async addCart() {
        try {
            const newCart = await cartModel.create({ products: [] });
            logger.info('Cart was created successfully');
            return newCart;
        } catch (error) {
            logger.error({ error, errorMsg: error.message });
            throw CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error creating cart.',
                code: Errors.NO_CART,
            });
        }
    }

    async getCartById(_id) {
        try {
            await idValidation(_id); // Validación de ID
            const cart = await cartModel.findPopulatedOne(_id);
            if (!cart) {
                throw CustomError.createError({
                    name: 'CartNotFoundError',
                    cause: `Cart ID ${_id} not found.`,
                    message: 'The cart does not exist.',
                    code: Errors.NO_CART,
                });
            }
            return cart;
        } catch (error) {
            logger.error({ error, errorMsg: error.message });
            throw error;
        }
    }

    async deleteCart(_id) {
        try {
            await idValidation(_id); // Validación de ID
            const cart = await this.getCartById(_id);
            await cartModel.deleteOne({ _id });
            logger.info(`The cart with ID: ${_id} was deleted successfully`);
            return cart;
        } catch (error) {
            logger.error({ error, errorMsg: error.message });
            throw error;
        }
    }
            // se agrega validacion de productos ya que no se espera gran flujo.
                 // Se podria optimizar rendimiento si no se consulta para dar error personalizado.
    async addProductToCart(productId, cartId) {
        try {
            // Validar IDs
            await idValidation(cartId); 
            await idValidation(productId); 
        
            // Verificar si el producto existe en la base de datos
            const productExists = await productService.getProductById(productId);
            if (!productExists) {
                throw CustomError.createError({
                    name: 'ProductNotFoundError',
                    cause: `Product ID ${productId} not found.`,
                    message: 'The product does not exist.',
                    code: Errors.NO_PRODUCT,
                });
            }
        
            // Obtener el carrito
            const cart = await this.getCartById(cartId);
            if (!cart) {
                throw CustomError.createError({
                    name: 'CartNotFoundError',
                    cause: `Cart ID ${cartId} not found.`,
                    message: 'The cart does not exist.',
                    code: Errors.NO_CART,
                });
            }
        
            // Agregar producto al carrito
            const existingProduct = cart.products.find((p) => p.idProduct.equals(productId));
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({ idProduct: productId, quantity: 1 });
            }
            

            // Guardar cambios
            await cart.save();
            logger.info(`Product ${productId} was added successfully to cart ${cartId}`);
         }catch (error) {
            if (error.name === 'ProductNotFoundError' || error.name === 'CartNotFoundError') {
                logger.warn(`${error.name}: ${error.cause}`);
                throw error; // Relanzar el error para que lo maneje el controlador
            }
            logger.error({ error, errorMsg: error.message });
            throw CustomError.createError({
                name: 'AddProductToCartError',
                cause: error.message,
                message: 'Error adding product to cart.',
                code: Errors.ADD_PRODUCT_ERROR,
            });
    }
}

    

async deleteProductFromCart(productId, cartId, removeCompletely = false) {
    try {
        // Validar IDs
        await idValidation(cartId); 
        await idValidation(productId); 
    
        // Verificar si el carrito existe
        const cart = await this.getCartById(cartId);
        if (!cart) {
            throw CustomError.createError({
                name: 'CartNotFoundError',
                cause: `Cart ID ${cartId} not found.`,
                message: 'The cart does not exist.',
                code: Errors.NO_CART,
            });
        }
    
        // Verificar si el producto existe en el carrito
        const existingProduct = cart.products.find((p) => p.idProduct.equals(productId));
        if (!existingProduct) {
            throw CustomError.createError({
                name: 'ProductNotFoundError',
                cause: `Product ID ${productId} not found in cart ${cartId}.`,
                message: 'The product does not exist in the cart.',
                code: Errors.NO_PRODUCT,
            });
        }
    
        // Eliminar el producto o actualizar la cantidad
        if (removeCompletely || existingProduct.quantity === 1) {
            cart.products = cart.products.filter((p) => !p.idProduct.equals(productId));
        } else {
            existingProduct.quantity -= 1;
        }
        

        // Guardar cambios
        await cart.save();
        logger.info(`Product ${productId} was ${removeCompletely ? 'completely removed' : 'partially removed'} from cart ${cartId}`);
    } catch (error) {
        if (error.name === 'ProductNotFoundError' || error.name === 'CartNotFoundError') {
            logger.warn(`${error.name}: ${error.cause}`);
            throw error; // Relanzar el error para que lo maneje el controlador
        }
        logger.error({ error, errorMsg: error.message });
        throw CustomError.createError({
            name: 'DeleteProductFromCartError',
            cause: error.message,
            message: 'Error deleting product from cart.',
            code: Errors.DELETE_PRODUCT_ERROR,
        });
    }
}

    async updateCart(cartId, productId, cartByUser) {
        try {
            await idValidation(cartId); // Validación de ID de carrito
            if (productId) {
                await idValidation(productId); // Validación de ID de producto, si existe
            }

            const cart = await this.getCartById(cartId);

            if (productId === null) {
                cart.products = cartByUser.products;
            } else {
                const existingProduct = cart.products.find((p) => p.idProduct.equals(productId));
                if (!existingProduct) {
                    throw CustomError.createError({
                        name: 'ProductNotFoundError',
                        cause: `Product ID ${productId} not found in cart ${cartId}.`,
                        message: 'The product does not exist in the cart.',
                        code: Errors.NO_PRODUCT,
                    });
                }
                existingProduct.quantity = cartByUser.quantity;
            }

            await cart.save();
            logger.info(`The cart with ID: ${cartId} was updated successfully`);
            return cart;
        } catch (error) {
            logger.error({ error, errorMsg: error.message });
            throw error;
        }
    }
}

export default CartService;

//   async purchase(cartId, user) {
//     try {
//       let userPurchasing = user;
//       let cart = await cartModel.findOne(cartId);
//       if (cart) {
//         const productIds = cart.products.map(product => product.idProduct.toString());
//         const productsQuantity = cart.products.map(quan => quan.quantity);
//         const productsData = await productService.getArrProductsData(productIds);
//         const prices = productsData.map(price => price.price);
//         const stocks = productsData.map(stock => stock.stock);

//         const multipliedPrices = prices.map((element, index) => element * productsQuantity[index]);
//         let priceAmount = 0;
//         for (let i = 0; i < multipliedPrices.length; i++) {
//           priceAmount += multipliedPrices[i];
//         }
//         let amount = priceAmount;
//         let tkData = {
//           purchaser: userPurchasing.email,
//           amount: amount,
//           products: productsData,
//           quantity: productsQuantity,
//         }
//         for(let i = 0; i < productsQuantity.length; i++){
//           if (productsQuantity[i] > stocks[i]) {
//             logger.warn(`No stock on product ${productsData[i].title}`)
//             throw new Error(`No stock on product ${productsData[i].title}`);
//           }
//         }
//         let ticket = await ticketService.createTicket(tkData);
//         for (let i = 0; i < productsQuantity.length; i++) {

//           let prodQuan = productsQuantity[i];
//           let prod = await productService.getProductById(productIds[i]);
//           let updatedProd = {
//             "title": prod.title,
//             "description": prod.description,
//             "price": prod.price,
//             "thumbnail": prod.thumbnail,
//             "code": prod.code,
//             "stock": prod.stock - prodQuan,
//             "category": prod.category,
//             "owner": prod.owner
//           }
//           await productService.updateProduct(productIds[i],updatedProd);
//           //clearing cart
//           await cartModel.updateOne(cartId);
//         }
//         return ticket;
  

//       } else {
//         logger.warn("That cart doesnt exist")
//         CustomError.createError({
//           name: "That cart doesnt exist",
//           cause: "The cart you have looking for doesnt exist in db. Error in find it, it could be a wrong id, please check it",
//           message: "The cart you have looking for doesnt exist.",
//           code: Errors.NO_CART,
//         }) 
//       }

//     } catch (error) {
//       logger.error({error: error, errorMsg: error.message})
//       throw new Error(error.message);
//     }

//   }
