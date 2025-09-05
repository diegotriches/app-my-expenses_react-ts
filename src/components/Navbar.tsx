import { NavLink } from "react-router-dom";

import "./Navbar.css";

const Navbar = () => {
    return (
            <nav>
                <h1>Meu gerenciador de gastos</h1>
                <NavLink to="/" end>Visão Geral</NavLink>
                <NavLink to="/movimentacao">Movimentação</NavLink>
                <NavLink to="/relatorios">Relatórios</NavLink>
            </nav>
    );
};

export default Navbar;