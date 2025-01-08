import { productModel } from '../methods/mongo/classes/products.dao.js'
// import CustomError from "../errors/custom-error.js";
// import { generateProductErrorInfo } from "../errors/product-error.js";
import logger from "../config/utils/logger.js";
export class ProductService {
    async getAll() {
        try {
            const queryResult = await productModel.getAll()
            return queryResult;
        } catch (error) {
            logger.error({error: error, errorMsg: error.message})
            throw new Error(error.message);
        }
    }

    async productValidation(title, description, price, thumbnail, code, stock, category, owner) {
        try {
            let product = {
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock,
                category: category,
                owner: owner || 'admin'
            }
            if (!code || !title || !description || !price || !thumbnail || !stock || !category || !owner) {
                logger.warn("Empty fields making a product")
                // CustomError.createError({
                //     name: "Empty fields",
                //     cause: generateProductErrorInfo(product),
                //     message: "Empty fields, please check it",
                //     code: Errors.EMPTY_FIELDS,
                // });
                throw new Error(error.message);
            }
        } catch (error) {
            logger.error({error: error, errorMsg: error.message})
            throw new Error(error.message);

        }
    }
    async addProduct(product) {
        try {
            await this.productValidation(product.title, product.description, product.price, product.thumbnail, product.code, product.stock, product.category, product.owner);
            let customA = {}
            let customB = {
                limit: 40
            }
            const query = await productModel.paginate(customA, customB);
            const {
                docs,
                ...rest
            } = query;
            let products = docs.map((doc) => {
                return {
                    _id: doc._id,
                    title: doc.title,
                    thumbnail: doc.thumbnail,
                    price: doc.price,
                    stock: doc.stock
                };
            });
            let checkCode = products.find((pCode) => pCode.code === product.code);
            if (checkCode) {
                logger.warn('Already exists a product with that code')
                throw new Error('Already exists a product with that code');
            }
            const newProduct = await productModel.create({
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                code: product.code,
                stock: product.stock,
                status: true,
                category: product.category,
                owner: product.owner || 'admin'

            });
            logger.info(`Product ${product.title} added succesfully`);
            return newProduct;
        } catch (error) {
            logger.error({error: error, errorMsg: error.message})
            throw new Error(error.message);
        }
    }
    async getProductById(_id) {
        try {
            const product = await productModel.findOne(_id);
            return product;
        } catch (error) {
            logger.warn("That product doesnt exist")
            // CustomError.createError({
            //     name: "That product doesnt exist",
            //     cause: "The product you have looking for doesnt exist in db. Error in find it, it could be a wrong id, please check it",
            //     message: "The product you have looking for doesnt exist.",
            //     code: Errors.NO_PRODUCT,
            // })
            throw new Error(error.message);
        }

    }
    async updateProduct(_id, product) {
        try {
            if (!_id) {
                logger.warn("That product doesnt exist")
            //     CustomError.createError({
            //         name: "That product doesnt exist",
            //         cause: "The product you have looking for doesnt exist in db. Error in find it, it could be a wrong id, please check it",
            //         message: "The product you have looking for doesnt exist.",
            //         code: Errors.NO_PRODUCT,
            //     });
             }
            this.productValidation(product.title, product.description, product.price, product.thumbnail, product.code, product.stock, product.category, product.owner);
            const updatedProduct = await productModel.updateOne(_id, product);
            logger.info(`The product with id: ${_id} was updated successfully`);
            return updatedProduct;
        } catch (error) {
            logger.error({error: error, errorMsg: error.message})
            throw new Error(error.message);
        }
    }
    async deleteProduct(_id) {
        try {
            const deletedProduct = await productModel.deleteProduct(_id);
            logger.info(`The product with id: ${_id} was deleted successfully`);
            return deletedProduct;
        } catch (error) {
            logger.warn("That product doesnt exist")
            // CustomError.createError({
            //     name: "That product doesnt exist",
            //     cause: "The product you have looking for doesnt exist in db. Error in find it, it could be a wrong id, please check it",
            //     message: "The product you have looking for doesnt exist.",
            //     code: Errors.NO_PRODUCT,
            // });
            throw new Error(error.message);
        }
    }
    async getProductData(page) {
        try {
            let customA = {}
            let customB = {
                page: page || 1,
                limit: 3
            }
            const query = await productModel.paginate(customA, customB);
            return query
        } catch (error) {
            logger.error({error: error, errorMsg: error.message})
            throw new Error(error.message);
        }
    }

    async getArrProductsData(arr) {
        try {
            const productsData = [];
    
            for (const id of arr) {
                const product = await this.getProductById(id);
                productsData.push(product);
            }
    
            return productsData;
            
        } catch (error) {
            logger.error({error: error, errorMsg: error.message})
            throw new Error(error.message);
        }
    }

    async getProductByOwner(email){
        try {
            const productsData = await productModel.getProductbyEmail(email);
            return productsData;
            
        } catch (error) {
            logger.error({error: error, errorMsg: error.message})
            throw new Error(error.message);
        }
    }

}

export default ProductService;