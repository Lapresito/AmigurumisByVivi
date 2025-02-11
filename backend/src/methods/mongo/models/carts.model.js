import { Schema, model } from 'mongoose';

const schema = new Schema(
    {
        products: [
            {
                idProduct: {
                    type: Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {
                    type: Number
                },
                _id: false
            }
        ]
    },
    {
        versionKey: false,
        timestamps: true, // MongoDB manejará `createdAt` y `updatedAt` automáticamente
    }
);

// Agregar índice para TTL basado en `updatedAt`
schema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 }); // 24 horas desde el último update

export const CartModel = model("carts", schema);
