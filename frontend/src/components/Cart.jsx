import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/ShoppingCartContext";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from 'axios';

const Cart = () => {
    const { cartItems, removeFromCart, clearCart, updateProductQuantity } = useContext(CartContext);
    const [total, setTotal] = useState(0);
    const [preferenceId, setPreferenceId] = useState('');
    const [showForm, setShowForm] = useState(false);

    // Estado del formulario
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        delivery: false
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        let newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        if (formData.delivery) newTotal += 200;
        setTotal(newTotal);
    }, [cartItems, formData.delivery]);

    initMercadoPago('APP_USR-7fbe4f47-ef71-4e71-b4b1-5f50a3709378', { locale: 'es-UY' });

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
        if (!formData.email.match(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/)) newErrors.email = "Correo inválido";
        if (!formData.phone.match(/^\d{9}$/)) newErrors.phone = "Teléfono inválido (9 dígitos)";
        if (formData.delivery && !formData.address.trim()) newErrors.address = "La dirección es obligatoria";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const createPreference = async () => {
        try {
            const body = {
                items: cartItems.map(item => ({
                    title: item.title,
                    unit_price: Number(item.price),
                    quantity: Number(item.quantity),
                    currency_id: "UYU"
                })),
                buyer: { ...formData },
                total
            };

            const response = await axios.post(
                'http://localhost:8080/payment/create-order',
                body,
                { headers: { 'Content-Type': 'application/json' } }
            );

            return response.data.id;
        } catch (error) {
            console.log("Error creando preferencia:", error);
        }
    };

    const handleBuy = async () => {
        if (!validateForm()) return;
        const id = await createPreference();
        if (id) setPreferenceId(id);
    };

    // 🔹 Manejar cambio de cantidad
    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity > 20) {
            console.log("Por más de 20 unidades, es un pedido especial");
            return;
        }
        updateProductQuantity(itemId, newQuantity);
    };

    return (
        <div>
            <h3>Carrito</h3>

            {cartItems.length > 0 ? (
                <>
                    {!showForm ? (
                        <>
                            {cartItems.map((item) => (
                                <div key={item._id}>
                                    <h4>{item.title}</h4>
                                    <p>Precio por unidad: ${item.price}</p>

                                    {/* 🔹 Input para cambiar cantidad */}
                                    <label>Cantidad:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item._id, Number(e.target.value))}
                                    />

                                    <p>Subtotal: ${item.price * item.quantity}</p>
                                    <button onClick={() => removeFromCart(item._id)}>Eliminar</button>
                                </div>
                            ))}

                            <div><strong>Total: ${total}</strong></div>
                            <button onClick={clearCart}>Vaciar carrito</button>
                        </>
                    ) : (
                        <>
                            {cartItems.map((item) => (
                                <div key={item._id}>
                                    <h4>{item.title} - ${item.price} x {item.quantity}</h4>
                                </div>
                            ))}
                            <div><strong>Total a pagar: ${total}</strong></div>
                        </>
                    )}

                    <button onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Volver al carrito" : "Ir a pagar"}
                    </button>

                    {showForm && (
                        <>
                            <h4>Información de compra</h4>
                            <form>
                                <input 
                                    type="text" placeholder="Nombre completo" 
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                                />
                                {errors.name && <p>{errors.name}</p>}

                                <input 
                                    type="email" placeholder="Correo electrónico" 
                                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                                />
                                {errors.email && <p>{errors.email}</p>}

                                <input 
                                    type="tel" placeholder="Teléfono (9 dígitos)" 
                                    value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                                />
                                {errors.phone && <p>{errors.phone}</p>}

                                <label>
                                    <input 
                                        type="checkbox" 
                                        checked={formData.delivery} 
                                        onChange={(e) => setFormData({ ...formData, delivery: e.target.checked })}
                                    /> ¿Entrega a domicilio? (+$200)
                                </label>

                                {formData.delivery && (
                                    <>
                                        <input 
                                            type="text" placeholder="Dirección" 
                                            value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                                        />
                                        {errors.address && <p>{errors.address}</p>}
                                    </>
                                )}
                            </form>

                            <button onClick={handleBuy}>Pagar</button>

                            {preferenceId && <Wallet initialization={{ preferenceId: preferenceId }} />}
                        </>
                    )}
                </>
            ) : (
                <p>El carrito está vacío.</p>
            )}
        </div>
    );
};

export default Cart;
