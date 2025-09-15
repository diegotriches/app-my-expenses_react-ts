import { NavLink } from "react-router-dom";
import { BsHouse, BsArrowLeftRight, BsBarChart } from "react-icons/bs";

import "./Navbar.css";

const Navbar = () => {
    return (
        <nav>
            <h1>My Expenses</h1>
            <div className="nav-links">
                <NavLink to="/" end><BsHouse className="icon" />Visão Geral</NavLink>
                <NavLink to="/movimentacao"><BsArrowLeftRight className="icon" />Movimentação</NavLink>
                <NavLink to="/relatorios"><BsBarChart className="icon" />Relatórios</NavLink>
            </div>
        </nav>

    );
};

export default Navbar;