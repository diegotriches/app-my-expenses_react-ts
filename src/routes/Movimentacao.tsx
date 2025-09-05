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

    const [data, setData] = useState(""); // Recebe as informações da data
    const [tipo, setTipo] = useState<"Entrada" | "Saída">("Entrada"); // Recebe as informações do tipo
    const [descricao, setDescricao] = useState(""); // Recebe as informações da descrição
    const [valor, setValor] = useState(""); // Recebe as informações do valor
    const [categoria, setCategoria] = useState(""); // Recebe as informações da categoria

    const [filtroData, setFiltroData] = useState(""); // Filtro para a data da movimentação feita
    const [filtroTipo, setFiltroTipo] = useState<"" | "Entrada" | "Saída">(""); // Filtro para o tipo de movimentação feita
    const [filtroValorMin, setValorMin] = useState(""); // Filtro para os valores mínimos das movimentações feitas
    const [filtroValorMax, setValorMax] = useState(""); // Filtro para os valores máximos das movimentações feitas
    const [filtroCategoria, setFiltroCategoria] = useState(""); // Filtro para a categoria de movimentação feita

    const navigate = useNavigate(); // Hook para navegação - utilizado para navegar entre a página de criar categorias

    const adicionarTransacao = () => { // Adiciona a transação
        if (!descricao || !valor || !categoria) return; // Verifica se as informações foram preenchidas? VERIFICAR

        const novaTransacao: Transacao = { // Determina quais informações serão inseridas e armazenadas na constante novaTransacao e que irá jogar os dados no array Transacao
            id: Date.now(),
            data,
            tipo,
            descricao,
            valor: Number(valor),
            categoria,
        };

        setTransacoes([...transacoes, novaTransacao]); // Armazena a nova transação dentro do Array de transações, sem sobrepôr as anteriores

        setData(""); // Reseta o campo Data para receber novos dados
        setDescricao(""); // Reseta o campo Descrição para receber novos dados
        setValor(""); // Reseta o campo Valor para receber novos dados
        setCategoria("") // Reseta o campo Categoria para receber novos dados
    };

    const categoriasDisponiveis = tipo === "Entrada" ? categoriasEntrada : categoriasSaida;

    const transacoesFiltradas = transacoes.filter((t) => {
        const matchData = filtroData ? t.data === filtroData : true;
        const matchTipo = filtroTipo ? t.tipo === filtroTipo : true;
        const matchValorMin = filtroValorMin ? t.valor >= Number(filtroValorMin) : true;
        const matchValorMax = filtroValorMax ? t.valor <= Number(filtroValorMax) : true;
        const matchCategoria = filtroCategoria ? t.categoria === filtroCategoria : true;

        return matchData && matchTipo && matchValorMin && matchValorMax && matchCategoria;
    });

    return (
        <>
            <div id='add-mov'>
                <h3>Adicionar Movimentação</h3>

                <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)} required
                />

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

            <div className="filtros">

                <h3>Filtros</h3>

                <input
                    type="date"
                    value={filtroData}
                    onChange={(e) => setFiltroData(e.target.value)}
                />

                <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value as "" | "Entrada" | "Saída")}>
                    <option value="">Todos os tipos</option>
                    <option value="Entrada">Entradas</option>
                    <option value="Saída">Saídas</option>
                </select>

                <input
                    type="text"
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                />

                <input
                    type="number"
                    placeholder='Valor mínimo'
                    value={filtroValorMin}
                    onChange={(e) => setValorMin(e.target.value)}
                />
                
                <input
                    type="number"
                    placeholder='Valor máximo'
                    value={filtroValorMax}
                    onChange={(e) => setValorMax(e.target.value)}
                />

            </div>

            <div id="mov-list">
                <h3>Lista de Movimentação</h3>

                <ul>
                    {transacoes.map((t, index) => (
                        <li key={index}>
                            ID: {t.id} || Data: {t.data} - {t.tipo} - {t.descricao} - R${t.valor.toFixed(2)} ({t.categoria})
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Movimentacao