import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loading from './Loading';
import ItemList from './ItemList';

const ItemListContainer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category } = useParams();

  useEffect(() => {
    const controller = new AbortController(); // Manejo de cancelación de peticiones

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products', { signal: controller.signal });
        if (!response.ok) throw new Error('Error al obtener productos');
        const data = await response.json();
        setProducts(data.payload || []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort(); // Cleanup al desmontar el componente
  }, []);

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;
  if (!products.length) return <p>No hay productos disponibles.</p>;

  // Filtrar productos solo si hay categoría
  const filteredProducts = category ? products.filter((product) => product.category === category) : products;

  return (
    <div>
      <ItemList products={filteredProducts} />
    </div>
  );
};

export default ItemListContainer;
