import { ProductService } from "../services/products.service.js";
import logger from "../config/utils/logger.js";
// import { ProductDTO } from '../dao/DTO/product.dto.js'
const productService = new ProductService;


class ProductController {


    async getAll(req, res) {
        try {
            const payload = await productService.getAll();
            res.status(200).json({
                status: "success",
                payload: payload
            })
        } catch (error) {
            res.status(400).json({
                status: "error",
                errorName: error.name,
                error: error.message
            })
        }
    }
    async getProductById(req, res) {
        try {
            const id = req.params.id;
            const product = await productService.getProductById(id);
            res.status(200).json({
                status: "success",
                message: `Product with id:${id}`,
                payload: product
            })

        } catch (error) {
            res.status(400).json({
                status: "error",
                errorName: error.name,
                error: error.message

            })
        }
    };
    async addProduct(req, res) {
        try {
            const product = req.body
            // const productToAdd = new ProductDTO(product)
            await productService.addProduct(product)
            res.status(201).json({
                status: "success",
                message: 'Added successfuly',
                payload: product
            })
        } catch (error) {
            res.status(400).json({
                status: "error",
                errorName: error.name,
                error: error.message
            })
        }
    };
    async delete(req, res) {
        try {
            const id = req.params.id;
            const product = await productService.deleteProduct(id);
            res.status(200).json({
                status: "success",
                message: `The product with id: ${id} was deleted succesfully!`,
                payload: product
            })
        } catch (error) {
            res.status(400).json({
                status: "error",
                errorName: error.name,
                error: error.message
            })
        }
    };
    async updateProduct(req, res) {
        try {
            const id = req.params.id;
            const productByUser = req.body
            const product = await productService.updateProduct(id, productByUser);
            res.status(200).json({
                status: "success",
                message: `The product with id: ${id} was updated succesfully!`,
                payload: product
            })
        } catch (error) {
            res.status(400).json({
                status: "error",
                errorName: error.name,
                error: error.message
            })
        }
    };

};

export const productController = new ProductController;