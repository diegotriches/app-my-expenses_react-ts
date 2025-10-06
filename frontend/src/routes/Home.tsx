import { usePeriodo } from '../components/PeriodoContext';
import type { Transacao } from "../types/transacao";
import PeriodoSelector from "../components/PeriodoSelector";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

import './Home.css'

interface Props {
  transacoes: Transacao[];
}

interface Cartao {
  id: number;
  nome: string;
  tipo: "credito" | "debito";
  limite: number;
  diaFechamento: number;
  diaVencimento: number;
}

interface FaturaCartao {
  cartao: string;
  totalFaturaAtual: number;
  limite: number;
  comprometido: number;
  disponivel: number;
}

function Home({ transacoes }: Props) {
  const { mesSelecionado, anoSelecionado } = usePeriodo();

  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [faturasCartoes, setFaturasCartoes] = useState<FaturaCartao[]>([]);

  // Buscar cartões no backend
  useEffect(() => {
    axios.get("http://localhost:5000/cartoes")
      .then((res) => {
        const dadosNormalizados = res.data.map((c: any) => ({
          ...c,
          tipo: c.tipo?.toLowerCase() ?? "debito",
          limite: c.limite ?? 0,
        }));
        setCartoes(dadosNormalizados);
      })
      .catch((err) => console.error("Erro ao carregar cartões:", err));
  }, []);

  // Calcular faturas e limites
  useEffect(() => {
    if (!transacoes.length || !cartoes.length) return;

    const novasFaturas: FaturaCartao[] = cartoes
      .filter((c) => c.tipo === "credito")
      .map((cartao) => {
        // --- Fatura atual ---
        const fechamento = cartao.diaFechamento;
        const hoje = new Date();

        let inicioFatura: Date;
        let fimFatura: Date;

        if (hoje.getDate() > fechamento) {
          // fatura vigente: após fechamento até próximo fechamento
          inicioFatura = new Date(hoje.getFullYear(), hoje.getMonth(), fechamento + 1);
          fimFatura = new Date(hoje.getFullYear(), hoje.getMonth() + 1, fechamento);
        } else {
          // fatura anterior ainda em aberto
          inicioFatura = new Date(hoje.getFullYear(), hoje.getMonth() - 1, fechamento + 1);
          fimFatura = new Date(hoje.getFullYear(), hoje.getMonth(), fechamento);
        }

        // Transações desse cartão
        const transacoesCartao = transacoes.filter(
          (t) => t.formaPagamento === "credito" && t.cartaoId === cartao.id
        );

        // Valor dentro da fatura atual
        const totalFaturaAtual = transacoesCartao
          .filter((t) => {
            const data = new Date(t.data);
            return data >= inicioFatura && data <= fimFatura;
          })
          .reduce((acc, t) => acc + t.valor, 0);

        // Comprometimento do limite (todas as compras não pagas até agora e futuras)
        const comprometido = transacoesCartao.reduce((acc, t) => acc + t.valor, 0);

        const disponivel = cartao.limite - comprometido;

        return {
          cartao: cartao.nome,
          totalFaturaAtual,
          limite: cartao.limite,
          comprometido,
          disponivel,
        };
      });

    setFaturasCartoes(novasFaturas);
  }, [transacoes, cartoes]);

  const transacoesFiltradas = transacoes.filter((t) => {
    const data = new Date(t.data);
    return (
      data.getMonth() === mesSelecionado &&
      data.getFullYear() === anoSelecionado
    );
  });

  const totalEntradas = transacoesFiltradas
    .filter((t) => t.tipo === "Entrada")
    .reduce((acc, t) => acc + t.valor, 0);

  const totalSaidas = transacoesFiltradas
    .filter((t) => t.tipo === "Saída")
    .reduce((acc, t) => acc + t.valor, 0);

  const saldo = totalEntradas - totalSaidas;

  const numeroTransacoes = transacoesFiltradas.length;

  const maiorGasto = transacoesFiltradas
    .filter((t) => t.tipo === "Saída")
    .reduce((max, t) => (t.valor > max ? t.valor : max), 0);

  const dataGrafico = [
    { name: "Entradas", value: totalEntradas },
    { name: "Saídas", value: totalSaidas },
  ];

  const COLORS = ["#00C49F", "#FF4C4C"];

  const totalPorCategoria: Record<string, number> = {};
  transacoesFiltradas
    .filter((t) => t.tipo === "Saída")
    .forEach((t) => {
      if (!totalPorCategoria[t.categoria]) {
        totalPorCategoria[t.categoria] = 0;
      }
      totalPorCategoria[t.categoria] += t.valor;
    });

  const dataBarChart = Object.entries(totalPorCategoria).map(([categoria, valor]) => ({
    categoria,
    valor,
  }));

  const COLORS_CATEGORIAS = [
    "#FF6384", "#36A2EB", "#FFCE56", "#8A2BE2", "#FF7F50",
    "#00CED1", "#3CB371", "#FFD700", "#FF69B4", "#87CEEB"
  ];

  return (
    <>
      <PeriodoSelector />
      <div className="cards-container">
        <div className="card entrada">
          <p>Entradas: R$ {totalEntradas.toFixed(2)}</p>
        </div>

        <div className="card saida">
          <p>Saídas: R$ {totalSaidas.toFixed(2)}</p>
        </div>

        <div className="card saldo">
          <p><strong>Saldo: R$ {saldo.toFixed(2)}</strong></p>
        </div>

        <div className="card transacoes">
          <h4>Total de Transações</h4>
          <p>{numeroTransacoes}</p>
        </div>

        <div className="card maior-gasto">
          <h4>Maior Gasto</h4>
          <p>R$ {maiorGasto.toFixed(2)}</p>
        </div>
      </div>

      <div className="cards-container">
        <div className="card faturas">
          <h4>Cartões de Crédito</h4>
          {faturasCartoes.length === 0 && <p>Nenhum cartão de crédito cadastrado.</p>}
          <ul>
            {faturasCartoes.map((f, i) => (
              <li key={i}>
                <strong>{f.cartao}</strong><br />
                Fatura atual: R$ {f.totalFaturaAtual.toFixed(2)}<br />
                Limite: R$ {f.limite.toFixed(2)}<br />
                Comprometido: R$ {f.comprometido.toFixed(2)}<br />
                Disponível: R$ {f.disponivel.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div id='relatorios-container'>
        <div className="graficos-relatorios">
          <div className="grafico-card">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataGrafico}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: R$ ${(value ?? 0).toFixed(2)}`}
                >
                  {dataGrafico.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grafico-card">
            <h4>Gastos por Categoria</h4>

            <ResponsiveContainer width='100%' height={350}>
              <BarChart data={dataBarChart} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="valor" isAnimationActive={true}>
                  {dataBarChart.map((entry, index) => (
                    <Cell key={entry.categoria} fill={COLORS_CATEGORIAS[index % COLORS_CATEGORIAS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;