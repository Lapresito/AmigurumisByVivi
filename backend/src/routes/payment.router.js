import express from "express";
import { paymentController } from "../controllers/payment.controller.js";



const paymentRouter = express.Router();

paymentRouter.post("/create-order", paymentController.createOrder );
paymentRouter.get("/success", paymentController.feedback );
paymentRouter.get("/failure", paymentController.feedback );
paymentRouter.get("/pending", paymentController.feedback );
paymentRouter.post("/webhook", paymentController.receiveWebhook );


export default paymentRouter;