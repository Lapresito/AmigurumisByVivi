import React from "react";
import Item from "./Item";

const ItemList = ({ products = [] }) => {  // Asegura que products sea un array por defecto
  if (!products.length) return <p>No hay productos disponibles.</p>;
  return (
    <div>
      {products.map((prod) => (
        <Item 
          key={prod._id}
          id={prod._id}
          title={prod.title}
          thumbnail={prod.thumbnail}
          description={prod.description}
          category={prod.category}
          price={prod.price} 
        />
      ))}
    </div>
  );
};

export default React.memo(ItemList);