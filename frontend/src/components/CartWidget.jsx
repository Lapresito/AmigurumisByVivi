import { useContext } from "react";
import { CartContext } from "../context/ShoppingCartContext";

const CartWidget = () => {
  const { cartItems } = useContext(CartContext);
  const quantity = cartItems.length;

  return (
    <div>
      🛒<span>{quantity}</span>
    </div>
  );
};

export default CartWidget;