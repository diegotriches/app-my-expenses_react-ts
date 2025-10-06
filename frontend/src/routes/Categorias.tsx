import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { BsPlusCircle, BsArrowLeft, BsPencil, BsTrash } from "react-icons/bs";

import './Categorias.css'

function Categorias() {
    const [tipo, setTipo] = useState<"Entrada" | "Saída">("Entrada");
    const [novaCategoria, setNovaCategoria] = useState("");
    const [categorias, setCategorias] = useState<{ id: number; nome: string; tipo: string }[]>([]);
    const [editandoId, setEditandoId] = useState<number | null>(null);

    const navigate = useNavigate(); // Hook para navegar entre a página de criar novas categorias

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        try {
            const res = await fetch("http://localhost:5000/categorias");
            const data = await res.json();
            setCategorias(data);
        } catch (err) {
            console.error("Erro ao carregar categorias:", err);
        }
    };

    const handleAdicionarOuEditar = async () => {
        if (!novaCategoria.trim()) return;

        try {
            if (editandoId) {
                // Editar categoria existente
                const res = await fetch(`http://localhost:5000/categorias/${editandoId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nome: novaCategoria.trim(), tipo })
                });
                const data = await res.json();
                setCategorias(categorias.map(cat => cat.id === editandoId ? data : cat));
                setEditandoId(null);
                setNovaCategoria("");
                alert("Categoria editada com sucesso!");
            } else {
                // Adicionar nova categoria
                const res = await fetch("http://localhost:5000/categorias", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nome: novaCategoria.trim(), tipo })
                });
                const data = await res.json();
                setCategorias([...categorias, data]);
                setNovaCategoria("");
                alert(`Categoria "${novaCategoria}" adicionada em ${tipo}`);
            }
        } catch (error) {
            console.error("Erro ao adicionar/editar categoria:", error);
        }
    };

    // Preparar edição
    const handleEditar = (cat: { id: number; nome: string; tipo: string }) => {
        setEditandoId(cat.id);
        setNovaCategoria(cat.nome);
        setTipo(cat.tipo as "Entrada" | "Saída");
    };

    // Excluir categoria
    const handleExcluir = async (id: number) => {
        if (!window.confirm("Deseja realmente excluir esta categoria?")) return;

        try {
            await fetch(`http://localhost:5000/categorias/${id}`, { method: "DELETE" });
            setCategorias(categorias.filter(cat => cat.id !== id));
            alert("Categoria excluída com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir categoria:", error);
        }
    };

    return (
        <div>
            <div id="add-categoria">
                <div id="top-btn">
                    <button onClick={() => navigate("/form-movimentacao")}><BsArrowLeft /> Voltar</button>
                    <h3>Gerenciar Categorias</h3>
                </div>
                <div className="linha-1">
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

                </div>
                <button onClick={handleAdicionarOuEditar}>
                    {editandoId ? "Salvar Edição" : <BsPlusCircle />}
                </button>
                {editandoId && (
                    <button onClick={() => { setEditandoId(null); setNovaCategoria(""); }}>
                        Cancelar
                    </button>
                )}
            </div>

            <div id="categoria-container">
                <h3>Categorias de Entrada</h3>

                <ul>
                    {categorias.filter(cat => cat.tipo === "Entrada").map((cat) => (
                        <li key={cat.id}>
                            {cat.nome}
                            <button onClick={() => handleEditar(cat)}><BsPencil /></button>
                            <button onClick={() => handleExcluir(cat.id)}><BsTrash /></button>
                        </li>
                    ))}
                </ul>

                <h3>Categorias de Saída</h3>

                <ul>
                    {categorias.filter(cat => cat.tipo === "Saída").map((cat) => (
                        <li key={cat.id}>
                            {cat.nome}
                            <button onClick={() => handleEditar(cat)}><BsPencil /></button>
                            <button onClick={() => handleExcluir(cat.id)}><BsTrash /></button>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}

export default Categorias