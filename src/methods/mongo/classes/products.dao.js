import { ProductModel } from "../models/products.model.js";

class ProductClass{
    async getAll(){
        const allProducts = await ProductModel.find();
        return allProducts;
    }
    async create(product){
        const newProduct = await ProductModel.create(product);
        return newProduct;
    }
    async findOne(id){
        const product = await ProductModel.findOne({ _id: id});
        return product;
    }
    async updateOne(id, product){
        await ProductModel.updateOne({_id: id},  {
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
            category: product.category,
            status: true
        });
    }
    async deleteProduct(id){
        const deletedProduct = await ProductModel.deleteOne({_id: id});
        return deletedProduct;
    }
    async getProductbyEmail(email){
        const product = await ProductModel.find({ owner: email});
        return product
    }

}


export const productModel = new ProductClass;