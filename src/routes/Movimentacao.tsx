import { useState } from 'react';
import type { Transacao } from '../App';

import './Movimentacao.css'

interface Props {
    transacoes: Transacao[];
    setTransacoes: React.Dispatch<React.SetStateAction<Transacao[]>>;
}

function Movimentacao({ transacoes, setTransacoes }: Props) {

    // Armazena as informações
    const [tipo, setTipo] = useState<"Entrada" | "Saída">("Entrada");
    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [categoria, setCategoria] = useState("");

    // Adiciona a transação
    const adicionarTransacao = () => {
        if (!descricao || !valor || !categoria) return;

        // Captura as informações inseridas e armazena na constante novaTransacao
        const novaTransacao: Transacao = {
            id: Date.now(),
            tipo,
            descricao,
            valor: Number(valor),
            categoria,
        };

        // Armazena a nova transação dentro do Array de transações, sem sobrepôr as anteriores
        setTransacoes([...transacoes, novaTransacao]);

        // Reseta os campos (inputs)
        setDescricao("");
        setValor("");
        setCategoria("")
    };

    return (
        <div id='movimentacao'>

            <h2>Adicionar Movimentação</h2>

            <select value={tipo} onChange={(e) => setTipo(e.target.value as "Entrada" | "Saída")}>
                <option value="Entrada">Entrada</option>
                <option value="Saída">Saída</option>
            </select>

            <input
                type="text"
                placeholder='Descrição'
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)} required
            />

            <input
                type="number"
                placeholder='Valor'
                value={valor}
                onChange={(e) => setValor(e.target.value)} required
            />

            <input
                type="text"
                placeholder='Categoria'
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)} required
            />

            <button onClick={adicionarTransacao}>Adicionar</button>


            <h3>Lista de Movimentação</h3>

            <ul>
                {transacoes.map((t, index) => (
                    <li key={index}>
                        {t.tipo} - {t.descricao} - R${t.valor.toFixed(2)} ({t.categoria})
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Movimentacao