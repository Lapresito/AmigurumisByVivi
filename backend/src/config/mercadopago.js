
import config from './config.js';
// SDK de Mercado Pago
import { MercadoPagoConfig } from 'mercadopago';

// Credenciales de vendedor prueba
const client = new MercadoPagoConfig({ accessToken: config.mercadoPagoToken });

export default client;