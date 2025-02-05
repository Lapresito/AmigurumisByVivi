import express from 'express';
import { productController } from '../controllers/products.controller.js';

const productsRouter = express.Router();

productsRouter.get("/", productController.getAll);
productsRouter.get("/:id", productController.getProductById);
// Rutas deprecadas, no se usarán desde el backend.
// Admin manejara directo la DB.
// productsRouter.post("/", productController.addProduct);
// productsRouter.delete("/:id", productController.delete);
// productsRouter.put("/:id", productController.updateProduct);

export default productsRouter;