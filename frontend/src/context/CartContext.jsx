// import { createContext, useState, useEffect } from "react";

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartId, setCartId] = useState(null);

//   useEffect(() => {
//     fetch("/api/carts", { credentials: "include" }) // Incluir cookies para sesiones
//       .then(res => res.json())
//       .then(data => setCartId(data.payload._id))
//       .catch(err => console.error("Error obteniendo carrito:", err));
//   }, []);

//   return (
//     <CartContext.Provider value={{ cartId, setCartId }}>
//       {children}
//     </CartContext.Provider>
//   );
// };
