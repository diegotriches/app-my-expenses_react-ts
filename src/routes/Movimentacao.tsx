import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Transacao } from '../types/transacao';
import { categoriasEntrada, categoriasSaida } from '../types/categorias';

import './Movimentacao.css'

interface Props {
    transacoes: Transacao[];
    setTransacoes: React.Dispatch<React.SetStateAction<Transacao[]>>;
}

function Movimentacao({ transacoes, setTransacoes }: Props) {

    const [tipo, setTipo] = useState<"Entrada" | "Saída">("Entrada"); // Recebe as informações do tipo
    const [descricao, setDescricao] = useState(""); // Recebe as informações da descrição
    const [valor, setValor] = useState(""); // Recebe as informações do valor
    const [categoria, setCategoria] = useState(""); // Recebe as informações da categoria

    const navigate = useNavigate(); // Hook para navegação - utiliza posteriormente para criar categorias

    const adicionarTransacao = () => { // Adiciona a transação
        if (!descricao || !valor || !categoria) return; // Verifica se as informações foram preenchidas? VERIFICAR

        const novaTransacao: Transacao = { // Determina quais informações serão inseridas e armazenadas na constante novaTransacao e que irá jogar os dados no array Transacao
            id: Date.now(),
            tipo,
            descricao,
            valor: Number(valor),
            categoria,
        };

        setTransacoes([...transacoes, novaTransacao]); // Armazena a nova transação dentro do Array de transações, sem sobrepôr as anteriores

        setDescricao(""); // Reseta o campo Descrição para receber novos dados
        setValor(""); // Reseta o campo Valor para receber novos dados
        setCategoria("") // Reseta o campo Categoria para receber novos dados
    };

    const categoriasDisponiveis = tipo === "Entrada" ? categoriasEntrada : categoriasSaida;

    return (
        <>
            <div id='add-mov'>
                <h3>Adicionar Movimentação</h3>

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

                <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}>
                    <option value="">Selecione uma categoria</option>
                    {categoriasDisponiveis.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <button onClick={adicionarTransacao}>Adicionar</button>

                <button onClick={() => navigate("/categorias")}>Categorias</button>

            </div>
            <div id="mov-list">
                <h3>Lista de Movimentação</h3>

                <ul>
                    {transacoes.map((t, index) => (
                        <li key={index}>
                            {t.tipo} - {t.descricao} - R${t.valor.toFixed(2)} ({t.categoria})
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Movimentacao