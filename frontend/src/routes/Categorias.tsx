import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriasEntrada, categoriasSaida, adicionarCategoria } from '../types/categorias';

import { BsPlusCircle } from "react-icons/bs";
import { BsArrowLeft } from "react-icons/bs";

import './Categorias.css'

function Categorias() {
    const [tipo, setTipo] = useState<"Entrada" | "Saída">("Entrada");
    const [novaCategoria, setNovaCategoria] = useState("");
    const navigate = useNavigate(); // Hook para navegar entre a página de criar novas categorias

    const handleAdicionar = () => {
        if (novaCategoria.trim()) {
            adicionarCategoria(tipo, novaCategoria.trim());
            setNovaCategoria("");
            alert(`Categoria "${novaCategoria}" adicionada em ${tipo}`);
        }
    }

    return (
        <div>
            <div id="add-categoria">
                <button onClick={() => navigate("/form-movimentacao")}><BsArrowLeft /> Voltar</button>

                <h2>Gerenciar Categorias</h2>

                <select value={tipo} onChange={(e) => setTipo(e.target.value as "Entrada" | "Saída")}>
                    <option value="Entrada">Entrada</option>
                    <option value="Saída">Saída</option>
                </select>

                <input
                    type="text"
                    placeholder='Nova categoria'
                    value={novaCategoria}
                    onChange={(e) => setNovaCategoria(e.target.value)}
                />

                <button onClick={handleAdicionar}><BsPlusCircle /></button>
            </div>

            <div id="categoria-container">
                <h3>Categorias de Entrada</h3>

                <ul>
                    {categoriasEntrada.map((cat) => (
                        <li key={cat}>{cat}</li>
                    ))}
                </ul>

                <h3>Categorias de Saída</h3>

                <ul>
                    {categoriasSaida.map((cat) => (
                        <li key={cat}>{cat}</li>
                    ))}
                </ul>
            </div>

        </div>
    );
}

export default Categorias