import { useState, useEffect, createContext } from "react";

export const CartContext = createContext(null);

const ShoppingCartContextProvider = ({ children }) => {
    const [cartId, setCartId] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const API_URL = "http://localhost:8080/api/carts";

    // 🛒 1. Obtener o crear el carrito al cargar la web
    useEffect(() => {
        const fetchOrCreateCart = async () => {
            try {
                let response = await fetch(`${API_URL}/session-cart`, { credentials: "include" });
                let data = await response.json();

                if (data.status === "success" && data.payload.cartId) {
                    setCartId(data.payload.cartId);
                    fetchCartDetails(data.payload.cartId);
                } else {
                    response = await fetch(`${API_URL}/`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    });

                    data = await response.json();
                    if (data.status === "success" && data.payload.cartId) {
                        setCartId(data.payload.cartId);
                        fetchCartDetails(data.payload.cartId);
                    }
                }
            } catch (error) {
                console.error("Error obteniendo o creando el carrito:", error);
            }
        };

        fetchOrCreateCart();
    }, []);

    // 🛒 2. Obtener los productos del carrito y formatearlos correctamente
    const fetchCartDetails = async (cartId) => {
      try {
          const response = await fetch(`${API_URL}/${cartId}`, { credentials: "include" });
          const data = await response.json();
  
          if (data.status === "success" && Array.isArray(data.payload.products)) {
              const formattedProducts = data.payload.products.map(item => ({
                  ...item.idProduct,
                  quantity: item.quantity
              }));
              setCartItems(formattedProducts);
          } else {
              setCartItems([]); // 🔹 Evita que el estado sea undefined
          }
      } catch (error) {
          console.error("Error obteniendo detalles del carrito:", error);
          setCartItems([]); // 🔹 En caso de error, mantenerlo como un array vacío
      }
  };
  

    // 🛒 3. Agregar un producto al carrito
    const addToCart = async (product, quantity) => {
        if (!cartId) return;
        try {
            const response = await fetch(`${API_URL}/${cartId}/product/${product._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ quantity }),
            });
            const updatedCart = await response.json();
            if (updatedCart.status === "success") {
                fetchCartDetails(cartId);
            }
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
        }
    };

    // 🛒 4. Eliminar un producto del carrito
    const removeFromCart = async (productId) => {
        if (!cartId) return;

        try {
            const response = await fetch(`${API_URL}/${cartId}/product/${productId}`, {
                method: "DELETE",
                credentials: "include",
            });
            const updatedCart = await response.json();
            if (updatedCart.status === "success") {
                fetchCartDetails(cartId);
            }
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
        }
    };

    // 🛒 5. Actualizar la cantidad de un producto en el carrito
    const updateProductQuantity = async (productId, quantity) => {
        if (!cartId) return;

        try {
            const response = await fetch(`${API_URL}/${cartId}/product/${productId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ quantity }),
            });
            const updatedCart = await response.json();
            if (updatedCart.status === "success") {
                fetchCartDetails(cartId);
            }
        } catch (error) {
            console.error("Error al actualizar cantidad del producto:", error);
        }
    };

    // 🛒 6. Vaciar el carrito completamente
    const clearCart = async () => {
        if (!cartId) return;

        try {
            const response = await fetch(`${API_URL}/${cartId}`, {
                method: "DELETE",
                credentials: "include",
            });
            const result = await response.json();
            if (result.status === "success") {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
        }
    };

    return (
        <CartContext.Provider value={{ cartId, cartItems, addToCart, removeFromCart, updateProductQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default ShoppingCartContextProvider;

