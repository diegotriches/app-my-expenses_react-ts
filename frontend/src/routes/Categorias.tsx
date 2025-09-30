import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { BsPlusCircle, BsArrowLeft } from "react-icons/bs";

import './Categorias.css'

function Categorias() {
    const [tipo, setTipo] = useState<"Entrada" | "Saída">("Entrada");
    const [novaCategoria, setNovaCategoria] = useState("");
    const [categorias, setCategorias] = useState<{ id: number; nome: string; tipo: string }[]>([]);
    const navigate = useNavigate(); // Hook para navegar entre a página de criar novas categorias

    useEffect(() => {
        fetch("http://localhost:5000/categorias")
        .then(res => res.json())
        .then(data => setCategorias(data))
        .catch(err => console.error("Erro ao carregar categorias:", err));
    }, []);

    const handleAdicionar = async () => {
        if (novaCategoria.trim()) {
            try {
                const response = await fetch("http://localhost:5000/categorias", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nome: novaCategoria.trim(), tipo })
                });
                const data = await response.json();
            
            setCategorias([...categorias, data]);
            setNovaCategoria("");
            alert(`Categoria "${novaCategoria}" adicionada em ${tipo}`);
            } catch (error) {
                console.error("Erro ao adicionar categoria:", error);
            }
        }
    };

    return (
        <div>
            <div id="add-categoria">
            <div id="top-btn">
                <button onClick={() => navigate("/form-movimentacao")}><BsArrowLeft /> Voltar</button>
                <h3>Gerenciar Categorias</h3>
            </div>

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
                    {categorias.filter(cat => cat.tipo === "Entrada").map((cat) => (
                        <li key={cat.id}>{cat.nome}</li>
                    ))}
                </ul>

                <h3>Categorias de Saída</h3>

                <ul>
                    {categorias.filter(cat => cat.tipo === "Saída").map((cat) => (
                        <li key={cat.id}>{cat.nome}</li>
                    ))}
                </ul>
            </div>

        </div>
    );
}

export default Categorias