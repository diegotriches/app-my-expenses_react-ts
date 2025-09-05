import { useState } from 'react';
import { categoriasEntrada, categoriasSaida, adicionarCategoria } from '../types/categorias';

function Categorias() {
    const [tipo, setTipo] = useState<"Entrada" | "Saída">("Entrada");
    const [novaCategoria, setNovaCategoria] = useState("");

    const handleAdicionar = () => {
        if (novaCategoria.trim()) {
            adicionarCategoria(tipo, novaCategoria.trim());
            setNovaCategoria("");
            alert(`Categoria "${novaCategoria}" adicionada em ${tipo}`);
        }
    }

    return (
        <div>
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

            <button onClick={handleAdicionar}>Adicionar</button>

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
    );
}

export default Categorias