import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

import { BsHouse, BsArrowLeftRight, BsBarChart, BsCashCoin, BsList, BsX, BsFillPersonFill } from "react-icons/bs";

import "./Navbar.css";

const Navbar = () => {
  const [menuAberto, setMenuAberto] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  // Buscar a foto do usuário ao carregar o Navbar
  useEffect(() => {
    axios.get("http://localhost:5000/usuarios")
      .then(res => {
        if (res.data && res.data.foto) {
          setFotoPerfil(`http://localhost:5000${res.data.foto}`);
        }
      })
      .catch(err => console.error("Erro ao carregar foto do usuário:", err));
  }, []);

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
        <NavLink to="/perfil" onClick={() => setMenuAberto(false)}>
          {fotoPerfil ? (
            <img src={fotoPerfil} alt="Perfil" className="foto-perfil" />
          ) : (
            <BsFillPersonFill/>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
