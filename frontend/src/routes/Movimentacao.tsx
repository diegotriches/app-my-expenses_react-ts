import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { exportarCSV } from '../utils/ExportCsv';
import { usePeriodo } from '../components/PeriodoContext';
import type { Transacao } from '../types/transacao';
import PeriodoSelector from "../components/PeriodoSelector";

import { BsFunnel, BsFunnelFill, BsPencil, BsFillTrash3Fill } from "react-icons/bs";

import './Movimentacao.css'

interface Props {
    transacoes: Transacao[];
    excluirTransacao: (id: number) => void;
}

function Movimentacao({ transacoes, excluirTransacao }: Props) {
    const { mesSelecionado, anoSelecionado } = usePeriodo();

    const [filtroValorMin, setFiltroValorMin] = useState(""); // Filtro para os valores mínimos das movimentações feitas
    const [filtroValorMax, setFiltroValorMax] = useState(""); // Filtro para os valores máximos das movimentações feitas
    const [filtroCategoria, setFiltroCategoria] = useState(""); // Filtro para a categoria de movimentação feita

    const [mostrarFiltro, setMostrarFiltro] = useState(false); // Opção para mostrar ou esconder os filtros
    const [abaAtiva, setAbaAtiva] = useState<"Entrada" | "Saída">("Entrada"); // Aba de seleção para mostrar apenas movimentações de entrada ou apenas movimentações de saída.

    const [hoverId, setHoverId] = useState<number | null>(null);
    const [excluirId, setExcluirId] = useState<number | null>(null);

    const navigate = useNavigate(); // Hook para navegação - utilizado para navegar entre a página de criar categorias

    const transacoesFiltradas = transacoes.filter((t) => {
        const data = new Date(t.data);

        const matchMes = data.getMonth() === mesSelecionado;
        const matchAno = data.getFullYear() === anoSelecionado;

        const matchValorMin = filtroValorMin ? t.valor >= Number(filtroValorMin) : true;
        const matchValorMax = filtroValorMax ? t.valor <= Number(filtroValorMax) : true;
        const matchCategoria = filtroCategoria ? t.categoria === filtroCategoria : true;

        const matchAba = abaAtiva === t.tipo;

        return matchMes && matchAno && matchValorMin && matchValorMax && matchCategoria && matchAba;
    });

    const categoriasDisponiveis = Array.from(
        new Set(
            transacoes.filter((t) => {
                const data = new Date(t.data);
                const matchMes = data.getMonth() === mesSelecionado;
                const matchAno = data.getFullYear() === anoSelecionado;
                const matchAba = t.tipo === abaAtiva;
                return matchMes && matchAno && matchAba;
            })
                .map((t) => t.categoria)
        )
    );

    useEffect(() => {
        setFiltroCategoria("");
    }, [abaAtiva]);

    const confirmarExclusao = (id: number) => setExcluirId(id);
    const cancelarExclusao = () => setExcluirId(null);
    const executarExclusao = () => {
        if (excluirId !== null) {
            excluirTransacao(excluirId);
            setExcluirId(null);
        }
    };

    return (
        <>
            <div id="movimentacao-page">
                <PeriodoSelector />
            </div>

            <button onClick={() => setMostrarFiltro(!mostrarFiltro)}>
                {mostrarFiltro ? <BsFunnel /> : <BsFunnelFill />}
            </button>
            <button
            onClick={() => exportarCSV(transacoes)}
            >
                Exportar CSV
            </button>
            
            {mostrarFiltro && (
                <div className="filtros">
                    <select
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                    >
                        <option value="">Todas as categorias</option>
                        {categoriasDisponiveis.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

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
                            className={`card-mov ${t.tipo.toLowerCase()} ${hoverId === t.id ? "ativo" : ''}`}
                            onClick={() => setHoverId(hoverId === t.id ? null : t.id)}
                        >
                            <div className="card-body">
                                <span className="data">{new Date(t.data).toLocaleDateString("pt-BR")}</span>
                                <p className="descricao">{t.descricao}</p>
                                <p className="categoria">{t.categoria}</p>

                                {t.parcela && <span className="parcela">Parcela {t.parcela}</span>}
                                {t.recorrente ? (<span className="recorrente">Recorrente</span>) : null}

                                <p className="valor">R$ {t.valor.toFixed(2)}</p>
                            </div>
                            {hoverId === t.id && (
                                <div className="acoes">
                                    <button onClick={() => navigate(`/form-movimentacao/${t.id}`)}><BsPencil /></button>
                                    <button onClick={() => confirmarExclusao(t.id)}><BsFillTrash3Fill /></button>
                                </div>
                            )}
                        </div>
                    ))}

                    {excluirId !== null && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <p>Tem certeza que deseja excluir esta movimentação?</p>
                                <div className="modal-buttons">
                                    <button className='btn-confirm' onClick={executarExclusao}>Sim</button>
                                    <button className='btn-cancel' onClick={cancelarExclusao}>Não</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Movimentacao