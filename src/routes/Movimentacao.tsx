import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Transacao } from '../types/transacao';
import { categoriasEntrada, categoriasSaida } from '../types/categorias';

import { BsFunnel, BsFunnelFill, BsPlusCircle, BsFloppy2Fill, BsPencil, BsFillTrash3Fill } from "react-icons/bs";

import './Movimentacao.css'

interface Props {
    transacoes: Transacao[];
    adicionarTransacao: (nova: Transacao) => void;
    editarTransacao: (atualizada: Transacao) => void;
    excluirTransacao: (id: number) => void;
}

function Movimentacao({ transacoes, adicionarTransacao, editarTransacao, excluirTransacao }: Props) {

    const [data, setData] = useState(""); // Recebe as informações da data
    const [tipo, setTipo] = useState<"Entrada" | "Saída">("Entrada"); // Recebe as informações do tipo
    const [descricao, setDescricao] = useState(""); // Recebe as informações da descrição
    const [valor, setValor] = useState(""); // Recebe as informações do valor
    const [categoria, setCategoria] = useState(""); // Recebe as informações da categoria

    const [modoLancamento, setModoLancamento] = useState<"Simples" | "Parcelado" | "Recorrente">("Simples");
    const [parcelas, setParcelas] = useState(1);
    const [mesesRecorrencia, setMesesRecorrencia] = useState(1);

    const [filtroData, setFiltroData] = useState(""); // Filtro para a data da movimentação feita
    const [filtroTipo, setFiltroTipo] = useState<"" | "Entrada" | "Saída">(""); // Filtro para o tipo de movimentação feita
    const [filtroValorMin, setFiltroValorMin] = useState(""); // Filtro para os valores mínimos das movimentações feitas
    const [filtroValorMax, setFiltroValorMax] = useState(""); // Filtro para os valores máximos das movimentações feitas
    const [filtroCategoria, setFiltroCategoria] = useState(""); // Filtro para a categoria de movimentação feita

    const [mostrarFiltro, setMostrarFiltro] = useState(false); // Opção para mostrar ou esconder os filtros

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

        const valorNumber = Number(valor);

        if (editandoId) {
            const transacaoAtualizada: Transacao = {
                id: editandoId,
                data,
                tipo,
                descricao,
                valor: valorNumber,
                categoria,
            };
            editarTransacao(transacaoAtualizada);
        } else {
                if (modoLancamento === "Parcelado" && parcelas > 1) {
                    for (let i = 1; i <= parcelas; i++) {
                        const dataParcela = new Date(data);
                        dataParcela.setMonth(dataParcela.getMonth() + (i - 1));

                        adicionarTransacao({
                            id: Date.now() + i,
                            data: dataParcela.toISOString().split("T")[0],
                            tipo,
                            descricao,
                            valor: valorNumber / parcelas,
                            parcela: `${i}/${parcelas}`,
                            categoria,
                        });
                    }
                } else if (modoLancamento === "Recorrente" && mesesRecorrencia > 1) {
                    for (let i = 0; i < mesesRecorrencia; i++) {
                        const dataRecorrencia = new Date(data);
                        dataRecorrencia.setMonth(dataRecorrencia.getMonth() + i);

                        adicionarTransacao({
                            id: Date.now() + i,
                            data: dataRecorrencia.toISOString().split("T")[0],
                            tipo,
                            descricao,
                            valor: valorNumber,
                            recorrente: true,
                            categoria,
                        });
                    }
                } else {
                    adicionarTransacao({ // Determina quais informações serão inseridas e armazenadas na constante novaTransacao e que irá jogar os dados no array Transacao
                        id: Date.now(),
                        data,
                        tipo,
                        descricao,
                        valor: valorNumber,
                        categoria,
                    });
                }
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
                <div id='form-transacao'>
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

                    <select value={modoLancamento} onChange={(e) => setModoLancamento(e.target.value as "Simples" | "Parcelado" | "Recorrente")}>
                        <option value="Simples">Simples</option>
                        <option value="Parcelado">Parcelado</option>
                        <option value="Recorrente">Recorrente</option>
                    </select>

                    {modoLancamento === "Parcelado" && (
                        <input
                            type="number"
                            placeholder='Número de parcelas'
                            value={parcelas}
                            onChange={(e) => setParcelas(Number(e.target.value))}
                        />
                    )}

                    {modoLancamento === "Recorrente" && (
                        <input
                            type="number"
                            placeholder='Meses de recorrência'
                            value={mesesRecorrencia}
                            onChange={(e) => setMesesRecorrencia(Number(e.target.value))}
                        />
                    )}

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
                    <h3>Lista de Movimentações</h3>

                    <div className="cards-mov">
                        {transacoesFiltradas.map((t) => (
                            <div
                                key={t.id}
                                className={`card-mov ${t.tipo.toLowerCase()} ${t.recorrente ? 'recorrente' : ''}`}
                            >
                                <div className="card-header">
                                    <span className="data">{t.data}</span>
                                    <div className="acoes">
                                        <button onClick={() => iniciarEdicao(t.id)}><BsPencil /></button>
                                        <button onClick={() => excluirTransacao(t.id)}><BsFillTrash3Fill /></button>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <p className="descricao">{t.descricao}</p>
                                    <p className="categoria">{t.categoria}</p>
                                    {t.parcela && <p className="parcela">{t.parcela}</p>}
                                </div>

                                <div className="card-valor">
                                    R$ {t.valor.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )
    }

    export default Movimentacao