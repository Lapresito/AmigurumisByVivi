import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/ShoppingCartContext";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from 'axios';

const Cart = () => {
    const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(newTotal);
    }, [cartItems]);

    console.log(cartItems);


    const [preferenceId, setPreferenceId] = useState('');

    initMercadoPago( 'APP_USR-7fbe4f47-ef71-4e71-b4b1-5f50a3709378', {locale: 'es-UY'});
    // const createPreference = async () => {
    //     try {
    //         const body = {
    //             items: []
    //         };
    //         console.log('Body enviado:',body);
    //         const response = await axios.post(
    //             'http://localhost:8080/payment/create-order',
    //             body,
    //             {
    //                 headers: {
    //                   'Content-Type': 'application/json',
    //                 }
    //               }
    //         );
    //         console.log("Respuesta del backend:", response.data);
    //         const { id } = response.data;
    //         console.log(id, 'extrajo el id');
    //         return id;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    const createPreference = async () => {
        try {
            const body = {
                items: cartItems.map(item => ({
                    title: item.title,
                    unit_price: Number(item.price),
                    quantity: Number(item.quantity),
                    currency_id: "UYU"
                }))
            };
    
            console.log('Body enviado:', body); // 🔹 Verifica que el objeto tenga el formato correcto antes de enviarlo
    
            const response = await axios.post(
                'http://localhost:8080/payment/create-order',
                body,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
    
            console.log("Respuesta del backend:", response.data);
            const { id } = response.data;
            console.log(id, 'extrajo el id');
            return id;
        } catch (error) {
            console.log(error);
        }
    };
    
    const handleBuy = async () => {
        const id = await createPreference();
        if(id){
            setPreferenceId(id);
        }
    };



    return (
        <div>
            <h3>Carrito</h3>
            {cartItems?.length > 0 ? (
                <>
                    {cartItems.map((item) => (
                        <div key={item._id}>
                            <h4>{item.title}</h4>
                            <p>Precio por unidad: ${item.price}</p>
                            <p>Cantidad: {item.quantity}</p>
                            <p>Subtotal: ${item.price * item.quantity}</p>

                            <button onClick={() => removeFromCart(item._id)}>Eliminar</button>
                        </div>
                    ))}

                    <div><strong>Total: ${total}</strong></div>
                    <button onClick={clearCart}>Vaciar carrito</button>
                    <p>ESTAS LISTO PARA COMPRAR?</p>
                    <button onClick={handleBuy}>Comprar</button>
                    {preferenceId && <Wallet initialization={{preferenceId: preferenceId}} />}
                </>
            ) : (
                <p>El carrito está vacío.</p>
            )}
        </div>
    );
};

export default Cart;
