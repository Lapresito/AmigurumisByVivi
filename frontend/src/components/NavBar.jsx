import { Link } from "react-router-dom";
import CartWidget from "./CartWidget";
import './cssComp/NavBar.css'; // Importa el archivo de estilos
import logo from "/logosinfondo.png"

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} />
        <h1>
          <Link to="/" className="navbar-brand">AmigurumisByVivi</Link>
        </h1>
      </div>

      <div className="navbar-links">
        <Link to="/catalogue" className="navbar-link">Catálogo</Link>

        <div className="navbar-categories">
          <button className="navbar-button">Categorías</button>
          <div className="dropdown">
            <Link to={`/category/Amigurumis`} className="dropdown-item">Amigurumis</Link>
            <Link to={`/category/Mantas-de-apego`} className="dropdown-item">Mantas de apego</Link>
            <Link to={`/category/Llaveros`} className="dropdown-item">Llaveros</Link>
            <Link to={`/category/Kits-Nacimiento`} className="dropdown-item">Kits Nacimiento</Link>
            <Link to={`/category/Especiales`} className="dropdown-item">Especiales</Link>
          </div>
        </div>
      </div>

      <div className="navbar-contact">
        <Link to="/contact" className="navbar-link">¡Contáctame!</Link>
      </div>

      <div className="navbar-cart">
        <Link to="/cart">
          <CartWidget />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
