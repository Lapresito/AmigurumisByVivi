

import { useState } from "react";

const Payment = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    delivery: "retiro",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al enviar los datos del pago");
      }

      const data = await response.json();
      console.log("Respuesta del backend:", data);
    } catch (error) {
      console.error("Error en el pago:", error);
    }
  };

  return (
    <div>
      <h2>Información de Pago</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre completo"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Celular"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Dirección"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <select name="delivery" value={formData.delivery} onChange={handleChange}>
          <option value="retiro">Retiro en tienda</option>
          <option value="delivery">Delivery</option>
        </select>
        <button type="submit">Pagar</button>
      </form>
    </div>
  );
};

export default Payment;