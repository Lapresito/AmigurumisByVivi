import { CartService } from "../services/carts.service.js";
const cartService = new CartService;


class CartController {
    async getAll(req, res) {
        try {
            let carts = await cartService.getAll();
            res.status(200).json({
                status: "success",
                message: 'Carts list',
                payload: carts
            });
        } catch (error) {
            res.status(400).json({
                status: "error",
                errorName: error.name,
                error: error.message
            });
        }
    }

    async newCart(req, res) {
        try {
            let newCart = await cartService.addCart();
            res.status(201).json({
                status: "success",
                message: 'Cart created successfuly',
                payload: newCart
            });
        } catch (error) {
            res.status(400).json({
                status: "error",
                errorName: error.name,
                error: error.message
            })
        }
    }
    async getCartById(req, res) {
        try {
            const id = req.params.id;
            const cart = await cartService.getCartById(id);
            res.status(200).json({
                status: "success",
                message: `Cart with id:${id}`,
                payload: cart
            })

        } catch (error) {
            res.status(400).json({
                status: "error",
                errorName: error.name,
                error: error.message
            })
        }
    }
    async addPorductToCart(req, res) {
        try {
            const pid = req.params.pid;
            const cid = req.params.cid;
            await cartService.addProductToCart(pid, cid);
            const cart = await cartService.getCartById(cid);
            res.status(201).json({
                status: "success",
                message: `Product with id:${pid} was added successfully to cart with id ${cid}`,
                payload: cart
            });

        } catch (error) {
            res.status(400).json({
                status: "error",
                errorName: error.name,
                error: error.message
            })

        }
    }
    async delete(req, res) {
        try {
            const id = req.params.id;
            const cart = await cartService.deleteCart(id);
            res.status(200).json({
                status: "success",
                message: `The cart with id: ${id} was deleted succesfully!`,
                payload: cart
            });
        } catch (error) {
            res.status(400).json({
                status: "error",
                errorName: error.name,
                error: error.message
            })

        }
    }
    async deleteProductFromCart(req, res) {
        try {
            const pid = req.params.pid; // ID del producto
            const cid = req.params.cid; // ID del carrito
            const { removeCompletely = false } = req.query; // Obtener la opción desde los parámetros de consulta
    
            // Llamar al servicio para eliminar el producto
            await cartService.deleteProductFromCart(pid, cid, removeCompletely === 'true');
    
            // Obtener el carrito actualizado
            const cart = await cartService.getCartById(cid);
    
            // Enviar respuesta exitosa
            res.status(200).json({
                status: "success",
                message: `Product with id:${pid} was ${removeCompletely === 'true' ? 'completely removed' : 'partially removed *-1 quantity*'} from cart with id ${cid}`,
                payload: cart
            });
        } catch (error) {
            // Manejo de errores
            res.status(400).json({
                status: "error",
                errorName: error.name,
                error: error.message
            });
        }
    }
    
    async updateQuantity(req, res) {
        try {
            const pid = req.params.pid;
            const cid = req.params.cid;
            await cartService.updateCart(cid, pid, req.body);
            const cart = await cartService.getCartById(cid);
            res.status(201).json({
                status: "success",
                message: `Cart with id ${cid} was uploaded successfuly`,
                payload: cart
            });
        } catch (error) {
            res.status(400).json({
                status: "error",
                errorName: error.name,
                error: error.message
            })
        }
    }
    async updateCart(req, res) {
        try {
            const cid = req.params.cid;
            await cartService.updateCart(cid, null, req.body);
            const cart = await cartService.getCartById(cid);
            res.status(201).json({
                status: "success",
                message: `Cart with id ${cid} was uploaded successfuly`,
                payload: cart
            });
        } catch (error) {
            res.status(400).json({
                status: "error",
                errorName: error.name,
                error: error.message
            })
        }
    }
    async purchase(req, res){
        try {
            const cid = req.params.cid
            const user = req.session.user 
            await cartService.purchase(cid, user);
            let tksData = await userService.getUserTks(user.email);
            let tkData = await tksData[tksData.length - 1];
            return res.status(200).render('purchased', {tkData});
        } catch (error) {
            return res.status(500).render('error',{error: error.message})
        }
    }

}
export const cartController = new CartController();