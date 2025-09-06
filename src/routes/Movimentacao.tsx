import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Transacao } from '../types/transacao';
import { categoriasEntrada, categoriasSaida } from '../types/categorias';

import { BsFunnel, BsFunnelFill, BsPlusCircle, BsFloppy2Fill, BsPencil } from "react-icons/bs";

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
    const [filtroValorMin, setFiltroValorMin] = useState(""); // Filtro para os valores mínimos das movimentações feitas
    const [filtroValorMax, setFiltroValorMax] = useState(""); // Filtro para os valores máximos das movimentações feitas
    const [filtroCategoria, setFiltroCategoria] = useState(""); // Filtro para a categoria de movimentação feita

    const [mostrarFiltro, setMostrarFiltro] = useState(true); // Opção para mostrar ou esconder os filtros

    const [editandoId, setEditandoId] = useState<number | null>(null);

    const navigate = useNavigate(); // Hook para navegação - utilizado para navegar entre a página de criar categorias

    const limparCampos = () => {
        setTipo('Entrada'); // Reseta o campo Entrada para receber novos dados
        setData(""); // Reseta o campo Data para receber novos dados
        setDescricao(""); // Reseta o campo Descrição para receber novos dados
        setValor(""); // Reseta o campo Valor para receber novos dados
        setCategoria(""); // Reseta o campo Categoria para receber novos dados
        setEditandoId(null);
    };

    const adicionarOuEditarTransacao = () => { // Adiciona a transação
        if (!data || !descricao || !valor || !categoria) return; // Verifica se as informações foram preenchidas? VERIFICAR

        if (editandoId) {
            const transacoesAtualizadas = transacoes.map((t) => t.id === editandoId ? { ...t, tipo, descricao, valor: Number(valor), categoria, data } : t);
            setTransacoes(transacoesAtualizadas);

        } else {
            const novaTransacao: Transacao = { // Determina quais informações serão inseridas e armazenadas na constante novaTransacao e que irá jogar os dados no array Transacao
                id: Date.now(),
                data,
                tipo,
                descricao,
                valor: Number(valor),
                categoria,
            };

            setTransacoes([...transacoes, novaTransacao]); // Armazena a nova transação dentro do Array de transações, sem sobrepôr as anteriores
        }

        limparCampos();
    };

    const iniciarEdicao = (id: number) => {
        const transacao = transacoes.find((t) => t.id === id);
        if (!transacao) return;

        setEditandoId(transacao.id);
        setData(transacao.data);
        setTipo(transacao.tipo);
        setDescricao(transacao.descricao);
        setValor(transacao.valor.toString());
        setCategoria(transacao.categoria);
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
                <h3>{editandoId ? "Editar Movimentação" : "Adicionar Movimentação"}</h3>

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

                <button onClick={adicionarOuEditarTransacao}>
                    {editandoId ? <BsFloppy2Fill /> : <BsPlusCircle />}
                </button>

                {editandoId && <button onClick={limparCampos}>Cancelar</button>}

                <button onClick={() => navigate("/categorias")}>Categorias</button>
            </div>

            <button onClick={() => setMostrarFiltro(!mostrarFiltro)}>
                {mostrarFiltro ? <BsFunnel /> : <BsFunnelFill />}
            </button>
            {mostrarFiltro && (
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
                        placeholder='Categoria'
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder='Valor mínimo'
                        value={filtroValorMin}
                        onChange={(e) => setFiltroValorMin(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder='Valor máximo'
                        value={filtroValorMax}
                        onChange={(e) => setFiltroValorMax(e.target.value)}
                    />

                    <button
                        onClick={() => {
                            setFiltroData("");
                            setFiltroTipo("");
                            setFiltroValorMin("");
                            setFiltroValorMax("");
                            setFiltroCategoria("");
                        }}
                    >
                        Limpar
                    </button>
                </div>
            )}

            <div id="mov-list">
                <h3>Lista de Movimentação</h3>

                <ul>
                    {transacoesFiltradas.map((t) => (
                        <li key={t.id}>
                            ID: {t.id} || Data: {t.data} - {t.tipo} - {t.descricao} - R${t.valor.toFixed(2)} ({t.categoria})
                            <button onClick={() => iniciarEdicao(t.id)}><BsPencil /></button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Movimentacao