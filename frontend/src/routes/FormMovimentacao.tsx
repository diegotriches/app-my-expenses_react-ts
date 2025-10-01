import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Transacao } from '../types/transacao';

import { BsFloppy2Fill, BsArrowLeft } from "react-icons/bs";

import './FormMovimentacao.css'

interface Props {
    transacoes: Transacao[];
    adicionarTransacao: (nova: Transacao) => Promise<void>;
    editarTransacao: (atualizada: Transacao) => Promise<void>; // assegure Promise aqui
}

function FormMovimentacao({ transacoes, adicionarTransacao, editarTransacao }: Props) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [data, setData] = useState("");
    const [tipo, setTipo] = useState<"Entrada" | "Saída">("Entrada");
    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [categoria, setCategoria] = useState("");
    const [categorias, setCategorias] = useState<{ id: number; nome: string; tipo: string }[]>([]);
    const [formaPagamento, setFormaPagamento] = useState<"credito" | "debito" | "dinheiro" | "pix">("dinheiro");
    const [modoLancamento, setModoLancamento] = useState<"A Vista" | "Parcelado" | "Recorrente">("A Vista");
    const [parcelas, setParcelas] = useState(1);
    const [mesesRecorrencia, setMesesRecorrencia] = useState(1);
    const [editandoId, setEditandoId] = useState<number | null>(null);

    // Carregar categorias do backend
    useEffect(() => {
        fetch("http://localhost:5000/categorias")
            .then(res => res.json())
            .then(data => setCategorias(data))
            .catch(err => console.error("Erro ao carregar categorias:", err));
    }, []);

    // Preencher campos se estiver editando (leva em conta o estado das categorias também)
    useEffect(() => {
        if (!id) return;
        const transacao = transacoes.find((t) => t.id === Number(id));
        if (!transacao) return;

        setEditandoId(transacao.id);
        setData(transacao.data);
        setTipo(transacao.tipo);
        setDescricao(transacao.descricao);
        setValor(transacao.valor.toString());
        setCategoria(transacao.categoria ?? "");
        setFormaPagamento(transacao.formaPagamento);
        if (transacao.parcela) setModoLancamento("Parcelado");
        else if (transacao.recorrente) setModoLancamento("Recorrente");
        else setModoLancamento("A Vista");
    }, [id, transacoes]);

    const limparCampos = () => {
        setTipo("Entrada");
        setData("");
        setDescricao("");
        setValor("");
        setCategoria("");
        setFormaPagamento("dinheiro");
        setModoLancamento("A Vista");
        setParcelas(1);
        setMesesRecorrencia(1);
        setEditandoId(null);
    };

    const adicionarOuEditarTransacao = async () => {
        if (!data || !descricao || !valor || !categoria) return;
        const valorNumber = Number(valor);

        try {
            if (editandoId) {
                // Edição
                const transacaoAtualizada: Transacao = {
                    id: editandoId,
                    data,
                    tipo,
                    descricao,
                    valor: valorNumber,
                    categoria,
                    formaPagamento,
                    parcela: modoLancamento === "Parcelado" ? `${parcelas}x` : undefined,
                    recorrente: modoLancamento === "Recorrente" ? true : undefined
                };
                // Aguardar a função do App que faz PUT + atualiza estado
                await editarTransacao(transacaoAtualizada);
            } else {
                // Criação (parcelado / recorrente / simples)
                if (modoLancamento === "Parcelado" && parcelas > 1) {
                    for (let i = 1; i <= parcelas; i++) {
                        const dataParcela = new Date(data);
                        dataParcela.setMonth(dataParcela.getMonth() + (i - 1));
                        await adicionarTransacao({
                            id: Date.now() + i,
                            data: dataParcela.toISOString().split("T")[0],
                            tipo,
                            descricao,
                            valor: valorNumber / parcelas,
                            categoria,
                            formaPagamento,
                            parcela: `${i}/${parcelas}`
                        });
                    }
                } else if (modoLancamento === "Recorrente" && mesesRecorrencia > 1) {
                    for (let i = 0; i < mesesRecorrencia; i++) {
                        const dataRecorrencia = new Date(data);
                        dataRecorrencia.setMonth(dataRecorrencia.getMonth() + i);
                        await adicionarTransacao({
                            id: Date.now() + i,
                            data: dataRecorrencia.toISOString().split("T")[0],
                            tipo,
                            descricao,
                            valor: valorNumber,
                            categoria,
                            formaPagamento,
                            recorrente: true
                        });
                    }
                } else {
                    await adicionarTransacao({
                        id: Date.now(),
                        data,
                        tipo,
                        descricao,
                        valor: valorNumber,
                        categoria,
                        formaPagamento
                    });
                }
            }

            limparCampos();
            navigate(-1);
        } catch (err) {
            console.error("Erro ao salvar transação:", err);
        }
    };

    const categoriasDisponiveis = categorias.filter(c => c.tipo === tipo);

    return (
        <>
            <div id='form-transacao'>
                <div id="top-menu">
                    <button onClick={() => navigate("/movimentacao")}><BsArrowLeft />Voltar</button>
                    <h3>{editandoId ? "Editar Movimentação" : "Nova Movimentação"}</h3>
                    <button onClick={() => navigate("/categorias")}>Categorias</button>
                </div>
                <div className="linha-1">
                    <input
                        type="date"
                        value={data}
                        onChange={(e) => setData(e.target.value)} required
                    />

                    <select value={tipo} onChange={(e) => setTipo(e.target.value as "Entrada" | "Saída")}>
                        <option value="Entrada">Entrada</option>
                        <option value="Saída">Saída</option>
                    </select>

                    <select
                        id="categoria"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}>
                        <option value="">Categoria</option>
                        {categoriasDisponiveis.map(c => (
                            <option key={c.id} value={c.nome}>{c.nome}</option>
                        ))}
                    </select>
                </div>

                <div id="descricao">
                    <input
                        type="text"
                        placeholder='Descrição'
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)} required
                    />
                </div>

                <div id="pagamento-container">
                    <input
                        type="number"
                        placeholder='Valor'
                        value={valor}
                        onChange={(e) => setValor(e.target.value)} required
                    />

                    <select
                        id="formaPagamento"
                        value={formaPagamento}
                        onChange={(e) => setFormaPagamento(e.target.value as "credito" | "debito" | "dinheiro" | "pix" )}>
                        <option value="credito">Cartão de Crédito</option>
                        <option value="debito">Cartão de Débito</option>
                        <option value="dinheiro">Dinheiro</option>
                        <option value="pix">Pix</option>
                    </select>

                    <select value={modoLancamento} onChange={(e) => setModoLancamento(e.target.value as "A Vista" | "Parcelado" | "Recorrente")}>
                        <option value="A Vista">A Vista</option>
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
                </div>
                <div id="save-btn">
                    <button type="button" onClick={adicionarOuEditarTransacao}>
                        <BsFloppy2Fill /> {editandoId ? "Salvar edições" : "Salvar"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default FormMovimentacao