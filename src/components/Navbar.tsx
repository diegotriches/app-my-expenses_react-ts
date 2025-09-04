import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import type { Transacao } from "../App";

import Home from "../routes/Home";
import Movimentacao from "../routes/Movimentacao";
import Relatorios from "../routes/Relatorios";

import "./Navbar.css";

interface NavbarProps {
    transacoes: Transacao[];
    setTransacoes: React.Dispatch<React.SetStateAction<Transacao[]>>;
}

const Navbar = ({ transacoes, setTransacoes }: NavbarProps) => {
    return (
        <BrowserRouter>
            <nav>
                <h1>Meu gerenciador de gastos</h1>
                <NavLink to="/" end>Visão Geral</NavLink>
                <NavLink to="/movimentacao">Movimentação</NavLink>
                <NavLink to="/relatorios">Relatórios</NavLink>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/movimentacao"
                    element={<Movimentacao transacoes={transacoes} setTransacoes={setTransacoes} />}
                />
                <Route path="/relatorios" element={<Relatorios />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Navbar;