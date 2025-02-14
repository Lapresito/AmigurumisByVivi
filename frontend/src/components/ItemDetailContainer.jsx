import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import ItemDetail from "./ItemDetail"; // Asegúrate de importar ItemDetail
import Loading from './Loading';

const ItemDetailContainer = () => {
  const [product, setProduct] = useState(null); // Inicializamos en null en vez de {}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener el producto");
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data.payload); // Asegúrate de que payload contiene el producto
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]); // Agregar id en dependencias

  return (
    <div>
      {loading && <Loading/>}
      {error && <p>Error: {error}</p>}
      {(!loading && !error && product) ? <ItemDetail product={product} /> : null}
    </div>
  );
};

export default ItemDetailContainer;
