import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import { exportarCSV } from '../utils/exportCSV';
import { usePeriodo } from '../components/PeriodoContext';
import type { Transacao } from '../types/transacao';
import PeriodoSelector from "../components/PeriodoSelector";

import { BsFunnel, BsFunnelFill, BsPencil, BsFillTrash3Fill, BsCreditCard2Back, BsCash, BsFillXDiamondFill, BsThreeDotsVertical, BsFiletypeCsv } from "react-icons/bs";

import './Movimentacao.css'

interface Props {
    transacoes: Transacao[];
    excluirTransacao: (id: number) => void;
}

function Movimentacao({ transacoes, excluirTransacao }: Props) {
    const navigate = useNavigate();

    const { mesSelecionado, anoSelecionado } = usePeriodo();

    const [filtroValorMin, setFiltroValorMin] = useState("");
    const [filtroValorMax, setFiltroValorMax] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [mostrarFiltro, setMostrarFiltro] = useState(false);
    const [abaAtiva, setAbaAtiva] = useState<"Entrada" | "Saída">("Entrada");
    const [hoverId, setHoverId] = useState<number | null>(null);
    const [excluirId, setExcluirId] = useState<number | null>(null);

    const [menuAberto, setMenuAberto] = useState(false);

    const [cartoes, setCartoes] = useState<{ id: number; nome: string; tipo: string }[]>([]);

    useEffect(() => {
        axios.get("http://localhost:5000/cartoes")
            .then(res => setCartoes(res.data))
            .catch(err => console.error("Erro ao carregar cartões:", err));
    }, []);


    // Filtragem das transações
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

    // Categorias disponíveis para filtro
    const categoriasDisponiveis = Array.from(
        new Set(
            transacoes
                .filter((t) => {
                    const data = new Date(t.data);
                    const matchMes = data.getMonth() === mesSelecionado;
                    const matchAno = data.getFullYear() === anoSelecionado;
                    const matchAba = t.tipo === abaAtiva;
                    return matchMes && matchAno && matchAba;
                })
                .map((t) => t.categoria)
        )
    );

    const getNomeFormaPagamento = (formaPagamento: string) => {
        if (formaPagamento === "dinheiro") return <BsCash />;
        if (formaPagamento === "pix") return <BsFillXDiamondFill />;

        if (formaPagamento.startsWith("cartao-")) {
            const id = Number(formaPagamento.split("-")[1]);
            const cartao = cartoes.find(c => c.id === id);
            return cartao ? `${cartao.nome} (${cartao.tipo})` : "Cartão";
        }

        return formaPagamento;
    };

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
            {mostrarFiltro && (
                <div className="filtros">
                    <select
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                    >
                        <option value="">Todas as categorias</option>
                        {categoriasDisponiveis.map(cat => (
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
                        }}>Limpar</button>
                </div>
            )}

            <div id="mov-list">
                <div id="top-menu">
                    <button onClick={() => setMostrarFiltro(!mostrarFiltro)}>
                        {mostrarFiltro ? <BsFunnel /> : <BsFunnelFill />}
                    </button>

                    <h3>Lista de Movimentações</h3>

                    <div className="menu-suspenso">
                        <button onClick={() => setMenuAberto(!menuAberto)}><BsThreeDotsVertical /></button>
                        {menuAberto && (
                            <div className="menu-opcoes">
                                <button
                                    onClick={() => exportarCSV(transacoes)}
                                >
                                    <BsFiletypeCsv />Exportar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

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
                    >Saídas</button>
                </div>

                <div className="cards-mov">
                    {transacoesFiltradas.map(t => (
                        <div
                            key={t.id}
                            className={`card-mov ${t.tipo.toLowerCase()} ${hoverId === t.id ? "ativo" : ''}`}
                            onClick={() => setHoverId(hoverId === t.id ? null : t.id)}
                        >
                            <div className="card-body">
                                <span className="data">{new Date(t.data).toLocaleDateString("pt-BR")}</span>
                                <p className="descricao">{t.descricao}</p>
                                <p>{getNomeFormaPagamento(t.formaPagamento)}</p>
                                <p className="categoria">{t.categoria}</p>

                                {t.parcela && <span className="parcela">Parcela {t.parcela}</span>}
                                {t.recorrente ? <span className="recorrente">Recorrente</span> : null}

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