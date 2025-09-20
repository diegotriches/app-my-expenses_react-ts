import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Transacao } from '../types/transacao';

import { BsFunnel, BsFunnelFill, BsPencil, BsFillTrash3Fill } from "react-icons/bs";

import './Movimentacao.css'

interface Props {
    transacoes: Transacao[];
    excluirTransacao: (id: number) => void;
}

function Movimentacao({ transacoes, excluirTransacao }: Props) {

    const [filtroData, setFiltroData] = useState(""); // Filtro para a data da movimentação feita
    const [filtroTipo, setFiltroTipo] = useState<"" | "Entrada" | "Saída">(""); // Filtro para o tipo de movimentação feita
    const [filtroValorMin, setFiltroValorMin] = useState(""); // Filtro para os valores mínimos das movimentações feitas
    const [filtroValorMax, setFiltroValorMax] = useState(""); // Filtro para os valores máximos das movimentações feitas
    const [filtroCategoria, setFiltroCategoria] = useState(""); // Filtro para a categoria de movimentação feita

    const [mostrarFiltro, setMostrarFiltro] = useState(false); // Opção para mostrar ou esconder os filtros

    const [abaAtiva, setAbaAtiva] = useState<"Entrada" | "Saída">("Entrada"); // Aba de seleção para mostrar apenas movimentações de entrada ou apenas movimentações de saída.

    const [hoverId, setHoverId] = useState<number | null>(null);

    const navigate = useNavigate(); // Hook para navegação - utilizado para navegar entre a página de criar categorias

    const transacoesFiltradas = transacoes.filter((t) => {
        const matchData = filtroData ? t.data === filtroData : true;
        const matchTipo = filtroTipo ? t.tipo === filtroTipo : true;
        const matchValorMin = filtroValorMin ? t.valor >= Number(filtroValorMin) : true;
        const matchValorMax = filtroValorMax ? t.valor <= Number(filtroValorMax) : true;
        const matchCategoria = filtroCategoria ? t.categoria === filtroCategoria : true;

        const matchAba = abaAtiva === t.tipo;

        return matchData && matchTipo && matchValorMin && matchValorMax && matchCategoria && matchAba;
    });

    return (
        <>
            <button onClick={() => navigate("/form-movimentacao")}>Adicionar Movimentação</button>

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
                <h3>Lista de Movimentações</h3>

                <div className="abas">
                    <button
                        className={abaAtiva === "Entrada" ? "ativa" : ""}
                        onClick={() => setAbaAtiva("Entrada")}
                    >
                        Entradas
                    </button>
                    <button
                        className={abaAtiva === "Saída" ? "ativa" : ""}
                        onClick={() => setAbaAtiva("Saída")}
                    >
                        Saídas
                    </button>
                </div>

                <div className="cards-mov">
                    {transacoesFiltradas.map((t) => (
                        <div
                            key={t.id}
                            onMouseEnter={() => setHoverId(t.id)}
                            onMouseLeave={() => setHoverId(null)}
                        >
                            <div className={`card-mov ${t.tipo.toLowerCase()}`}>
                                <div className="card-header">
                                    <span className="data">{new Date(t.data).toLocaleDateString("pt-BR")}</span>
                                    <p className="descricao">{t.descricao}</p>
                                    <p className="categoria">{t.categoria}</p>

                                    {t.parcela && <span className="parcela">Parcela {t.parcela}</span>}
                                    {t.recorrente && <span className="recorrente">Recorrente</span>}

                                    <div className="card-valor">
                                        R$ {t.valor.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                            {hoverId === t.id && (
                                <div className="acoes">
                                    <button onClick={() => navigate(`/form-movimentacao/${t.id}`)}><BsPencil /></button>
                                    <button onClick={() => excluirTransacao(t.id)}><BsFillTrash3Fill /></button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Movimentacao