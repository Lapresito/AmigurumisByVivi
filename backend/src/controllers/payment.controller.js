// import { ProductService } from "../services/products.service.js";
// import logger from "../config/utils/logger.js";
// import { ProductDTO } from '../dao/DTO/product.dto.js'
// const paymentService = new PaymentService;
import config from "../config/config.js";
import client from "../config/mercadopago.js";
import { Preference } from "mercadopago";
import logger from "../config/utils/logger.js";


class PaymentController {


    async createOrder(req, res) {
        try {
            logger.info('Somebody is trying to create an order');
            console.log(req.body);
            let result;
            const preference = new Preference(client);
            await preference.create({
                body: {
                items: req.body.items,
                // [
                //     {
                //         title: req.body.title,
                //         unit_price: Number(req.body.price),
                //         quantity: Number(req.body.quantity),
                //         currency_id: 'UYU'
                //     }
                // ],
                back_urls: {
                    success: `${config.frontendUrl}/gracias`,
                    failure: `${config.frontendUrl}/gracias`,
                    pending: `${config.frontendUrl}/gracias`
                },
                auto_return: 'approved',}
            }).then((response) => {
                result = response;
            }).catch((error) => {
                console.log(error);
            });

                
            console.log(result)
            
            res.json({ id: result.id  /*message: 'sale??'*/});
        } catch (error) {
            res.status(400).json({
                status: "error",
                errorName: error.name,
                error: error.message
            })
        }
    };


    async feedback(req, res) {
        try {
           res.json({
                Payment: req.query.payment_id,
                Status: req.query.status,
                MerchantOrder: req.query.merchant_order_id
           });
        } catch (error) {
            res.status(400).json({
                status: "error",
                errorName: error.name,
                error: error.message
            })
        }
    }
    async receiveWebhook(req, res) {
        try {
            const data = req.query;
            logger.info(data);
            res.status(200).json({
                status: "success",
                message: "webhook received"
            })
        } catch (error) {
            res.status(400).json({
                status: "error",
                errorName: error.name,
                error: error.message
            })
        }
    }
};

export const paymentController = new PaymentController();