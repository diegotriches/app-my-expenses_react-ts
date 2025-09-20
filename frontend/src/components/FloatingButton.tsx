import { useLocation, useNavigate } from "react-router-dom";
import { BsPlusCircle } from "react-icons/bs";

import "./FloatingButton.css"

export default function FloatingButton() {
    const location = useLocation();
    const navigate = useNavigate();

    const rotasPermitidas = ["/movimentacao", "/", "/relatorios"]; // Rotas onde o botão deve aparecer

    if (!rotasPermitidas.includes(location.pathname)) { // Verifica se a rota atual está na lista
        return null;
    }

    return (
        <button
        className="fab"
        onClick={() => navigate("/form-movimentacao")}
        >
            <BsPlusCircle />
        </button>
    );
}