import express from 'express';
import { cartController } from '../controllers/carts.controller.js';


const cartsRouter = express.Router();


cartsRouter.post("/", cartController.newCart);
cartsRouter.get("/session-cart", cartController.getSessionCart);
cartsRouter.get("/:id", cartController.getCartById);
cartsRouter.post("/:cid/product/:pid", cartController.addPorductToCart);
cartsRouter.delete("/:id", cartController.delete);
cartsRouter.delete("/:cid/product/:pid", cartController.deleteProductFromCart);
cartsRouter.put("/:cid/product/:pid", cartController.updateQuantity);
cartsRouter.put("/:cid", cartController.updateCart);


//toDo
cartsRouter.get('/:cid/purchase', cartController.purchase);


//Deprecate

//cartsRouter.get("/", cartController.getAll);

export default cartsRouter;