import { useState } from "react";
import { NavLink } from "react-router-dom";
import { BsHouse, BsArrowLeftRight, BsBarChart, BsCashCoin, BsList, BsX } from "react-icons/bs";

import "./Navbar.css";

const Navbar = () => {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <h1 className="logo">
          <BsCashCoin id="logo" /> MyExpenses
        </h1>

        <button className="menu-btn" onClick={toggleMenu}>
          {menuAberto ? <BsX size={28} /> : <BsList size={28} />}
        </button>
      </div>

      <div className={`nav-links ${menuAberto ? "ativo" : ""}`}>
        <NavLink to="/" end onClick={() => setMenuAberto(false)}>
          <BsHouse className="icon" />Home
        </NavLink>
        <NavLink to="/movimentacao" onClick={() => setMenuAberto(false)}>
          <BsArrowLeftRight className="icon" />Movimentação
        </NavLink>
        <NavLink to="/relatorios" onClick={() => setMenuAberto(false)}>
          <BsBarChart className="icon" />Relatórios
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
