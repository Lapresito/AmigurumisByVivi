import { useState, useContext } from "react";
import { CartContext } from "../context/ShoppingCartContext"; // Importamos el contexto

const ItemDetail = ({ product }) => {
    const [quantity, setQuantity] = useState(1); // Estado para la cantidad seleccionada
    const cartId = useContext(CartContext); // Usamos el contexto del carrito
    const { addToCart } = useContext(CartContext); // Usamos el contexto del carrito
    const thumbnail = 'https://picsum.photos/200/300';
    console.log(cartId, "CART ID");

    // Función para aumentar la cantidad (máximo 20)
    const increaseQuantity = () => {
        setQuantity((prev) => {
            if (prev < 20) {
                return prev + 1;
            } else {
                console.log("¡No se pueden hacer pedidos mayores a 20! Si quieres hacer un pedido especial, contactame.");
                return prev;
            }
        });
    };

    // Función para disminuir la cantidad (mínimo 1)
    const decreaseQuantity = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    // Función para añadir al carrito si la cantidad es mayor a 0
    const handleAddToCart = async () => {
        console.log(product, "EN HANDDLE ADD TO CART");
        if (quantity > 0) {
            console.log(`Añadido ${quantity} ${product.title} al carrito`);
            console.log(addToCart);
            addToCart(product, quantity);
        }
    };

    return (
        <div key={product.id}>
            <img src={thumbnail} alt={product.title} />
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p>Categoría: {product.category}</p>
            <p>Precio: ${product.price}</p>

            {/* Contador de cantidad */}
            <div>
                <button onClick={decreaseQuantity}>-</button>
                <span> {quantity} </span>
                <button onClick={increaseQuantity}>+</button>
            </div>

            {/* Botón para agregar al carrito */}
            <button onClick={handleAddToCart}>
                Agregar al carrito
            </button>
        </div>
    );
};

export default ItemDetail;