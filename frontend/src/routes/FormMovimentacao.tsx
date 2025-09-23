import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Transacao } from '../types/transacao';
import { categoriasEntrada, categoriasSaida } from '../types/categorias';

import { BsFloppy2Fill, BsArrowLeft } from "react-icons/bs";

import './FormMovimentacao.css'

interface Props {
    transacoes: Transacao[];
    adicionarTransacao: (nova: Transacao) => void;
    editarTransacao: (atualizada: Transacao) => void;
}

function FormMovimentacao({ transacoes, adicionarTransacao, editarTransacao }: Props) {
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            const transacao = transacoes.find((t) => t.id === Number(id));
            if (transacao) {
                setEditandoId(transacao.id);
                setData(transacao.data);
                setTipo(transacao.tipo);
                setDescricao(transacao.descricao);
                setValor(transacao.valor.toString());
                setCategoria(transacao.categoria);
                if (transacao.parcela) setModoLancamento("Parcelado");
                if (transacao.recorrente) setModoLancamento("Recorrente");
            }
        }
    }, [id, transacoes]);

    const [data, setData] = useState(""); // Recebe as informações da data
    const [tipo, setTipo] = useState<"Entrada" | "Saída">("Entrada"); // Recebe as informações do tipo
    const [descricao, setDescricao] = useState(""); // Recebe as informações da descrição
    const [valor, setValor] = useState(""); // Recebe as informações do valor
    const [categoria, setCategoria] = useState(""); // Recebe as informações da categoria

    const [modoLancamento, setModoLancamento] = useState<"A Vista" | "Parcelado" | "Recorrente">("A Vista");
    const [parcelas, setParcelas] = useState(1);
    const [mesesRecorrencia, setMesesRecorrencia] = useState(1);

    const [editandoId, setEditandoId] = useState<number | null>(null);

    const navigate = useNavigate(); // Hook para navegação - utilizado para navegar entre a página de criar categorias

    const limparCampos = () => {
        setTipo('Entrada'); // Reseta o campo Entrada para receber novos dados
        setData(""); // Reseta o campo Data para receber novos dados
        setDescricao(""); // Reseta o campo Descrição para receber novos dados
        setValor(""); // Reseta o campo Valor para receber novos dados
        setCategoria(""); // Reseta o campo Categoria para receber novos dados
        setModoLancamento("A Vista")
        setEditandoId(null);
    };

    const adicionarOuEditarTransacao = () => { // Adiciona ou edita uma transação.
        if (!data || !descricao || !valor || !categoria) return; // Verifica se as informações foram preenchidas, senão finaliza a função.

        const valorNumber = Number(valor); // Cria a função para receber o valor de cada parcela após a divisão. Ou o valor inteiro no caso de recorrência.

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
        navigate(-1);
    };

    const categoriasDisponiveis = tipo === "Entrada" ? categoriasEntrada : categoriasSaida;

    return (
        <>
            <div id="top-menu">
                <button onClick={() => navigate("/movimentacao")}><BsArrowLeft />Voltar</button>
                <h3>{editandoId ? "Editar Movimentação" : "Adicionar Movimentação"}</h3>
                <button onClick={() => navigate("/categorias")}>Categorias</button>
            </div>
            <div id='form-transacao'>
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
                        {categoriasDisponiveis.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
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
                    <button onClick={adicionarOuEditarTransacao}>
                        <BsFloppy2Fill /> {editandoId ? "Salvar edições" : "Salvar"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default FormMovimentacao