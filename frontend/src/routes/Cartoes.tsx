import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import { BsPlusCircle, BsArrowLeft } from "react-icons/bs";

interface Cartao {
    id: number;
    nome: string;
    tipo: string; // "Crédito" | "Débito"
}

function Cartoes() {
    const [cartoes, setCartoes] = useState<Cartao[]>([]);
    const [nome, setNome] = useState("");
    const [tipo, setTipo] = useState("Crédito");

    const navigate = useNavigate();

    // Carregar cartões
    useEffect(() => {
        axios.get("http://localhost:5000/cartoes")
            .then(res => setCartoes(res.data))
            .catch(err => console.error("Erro ao carregar cartões:", err));
    }, []);

    // Adicionar novo cartão
    const adicionarCartao = () => {
        if (!nome) return alert("Digite um nome para o cartão");

        axios.post("http://localhost:5000/cartoes", { nome, tipo })
            .then(res => {
                setCartoes([...cartoes, res.data]);
                setNome("");
                setTipo("Crédito");
            })
            .catch(err => console.error("Erro ao adicionar cartão:", err));
    };

    return (
        <>
            <div id="add-categoria">
                <div id="top-btn">
                    <button onClick={() => navigate("/form-movimentacao")}><BsArrowLeft /> Voltar</button>
                    <h3>Cadastro de Cartões</h3>
                </div>
                <input
                    type="text"
                    placeholder="Nome do cartão"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option value="Crédito">Crédito</option>
                    <option value="Débito">Débito</option>
                </select>
                <button onClick={adicionarCartao}><BsPlusCircle /></button>
            </div>

            <div id="categoria-container">
                <h3>Meus Cartões</h3>
                <ul>
                    {cartoes.map((c) => (
                        <li key={c.id}>
                            {c.nome} - {c.tipo}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Cartoes;