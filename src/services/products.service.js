import { productModel } from '../methods/mongo/classes/products.dao.js';
import { idValidation } from '../config/utils/mongo.js';
import CustomError from '../errors/custom-error.js';
import { generateProductErrorInfo } from '../errors/product-error.js';
import Errors from '../errors/enums.js';
import logger from '../config/utils/logger.js';

export class ProductService {
    async getAll() {
        try {
            const queryResult = await productModel.getAll();
            return queryResult;
        } catch (error) {
            logger.error({ error: error, errorMsg: error.message });
            throw CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error retrieving products.',
                code: Errors.NO_PRODUCT,
            });
        }
    }

    validateProductFields(product) {
        const { title, description, price, thumbnail, code, category } = product;
        if (!title || !description || !price || !thumbnail || !code || !category) {
            logger.warn('Empty fields detected while validating product');
            throw CustomError.createError({
                name: 'ValidationError',
                cause: generateProductErrorInfo(product),
                message: 'Invalid product data. Please check missing fields.',
                code: Errors.EMPTY_FIELDS,
            });
        }
    }

    async addProduct(product) {
        try {
            this.validateProductFields(product);

            const existingProduct = await productModel.findCode(product.code);
            if (existingProduct) {
                logger.warn('A product with this code already exists');
                throw CustomError.createError({
                    name: 'DuplicateProductError',
                    cause: `Product code ${product.code} already exists.`,
                    message: 'A product with this code already exists.',
                    code: Errors.NO_PRODUCT,
                });
            }

            const newProduct = await productModel.create({
                ...product,
                status: true,
            });
            logger.info(`Product ${product.title} added successfully`);
            return newProduct;
        } catch (error) {
            logger.error({ error: error, errorMsg: error.message });
            throw error;
        }
    }

    async getProductById(_id) {
        try {
            await idValidation(_id);
            const product = await productModel.findOne(_id);
            if (!product) {
                throw CustomError.createError({
                    name: 'ProductNotFoundError',
                    cause: `Product ID ${_id} not found in database.`,
                    message: 'The product does not exist.',
                    code: Errors.NO_PRODUCT,
                });
            }
            return product;
        } catch (error) {
            logger.error({ error: error, errorMsg: error.message });
            throw error;
        }
    }

    async updateProduct(_id, product) {
        try {
            await idValidation(_id);

            const existingProduct = await productModel.findOne(_id);
            if (!existingProduct) {
                throw CustomError.createError({
                    name: 'ProductNotFoundError',
                    cause: `Product ID ${_id} not found.`,
                    message: 'Cannot update non-existent product.',
                    code: Errors.NO_PRODUCT,
                });
            }

            this.validateProductFields(product);

            const updatedProduct = await productModel.updateOne(_id, product);
            logger.info(`The product with ID: ${_id} was updated successfully`);
            return updatedProduct;
        } catch (error) {
            logger.error({ error: error, errorMsg: error.message });
            throw error;
        }
    }

    async deleteProduct(_id) {
        try {
            await idValidation(_id);

            const existingProduct = await productModel.findOne(_id);
            if (!existingProduct) {
                throw CustomError.createError({
                    name: 'ProductNotFoundError',
                    cause: `Product ID ${_id} not found.`,
                    message: 'Cannot delete non-existent product.',
                    code: Errors.NO_PRODUCT,
                });
            }

            const deletedProduct = await productModel.deleteProduct(_id);
            logger.info(`The product with ID: ${_id} was deleted successfully`);
            return deletedProduct;
        } catch (error) {
            logger.error({ error: error, errorMsg: error.message });
            throw error;
        }
    }
}

export default ProductService;