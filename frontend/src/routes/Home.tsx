import { usePeriodo } from '../components/PeriodoContext';
import { useEffect, useState } from "react";
import axios from "axios";

import type { Transacao } from "../types/transacao";
import PeriodoSelector from "../components/PeriodoSelector";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

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

  const [nomeUsuario, setNomeUsuario] = useState<string>("");

  // Buscar usuário no backend
  useEffect(() => {
    axios.get("http://localhost:5000/usuarios")
      .then(res => {
        if (res.data && res.data.nome) {
          // Caso o endpoint retorne um único usuário
          setNomeUsuario(res.data.nome);
        } else if (Array.isArray(res.data) && res.data.length > 0) {
          // Caso o endpoint retorne uma lista
          setNomeUsuario(res.data[0].nome);
        }
      })
      .catch(err => console.error("Erro ao carregar dados do usuário:", err));
  }, []);

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

    const novasFaturas: FaturaCartao[] = cartoes.map((cartao) => {
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
        (t) => t.formaPagamento === "cartao" && t.cartaoId === cartao.id
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

  // Gráfico de Barras → Entradas x Saídas
  const dataBarChart = [
    { name: "Entradas", value: totalEntradas },
    { name: "Saídas", value: totalSaidas },
  ];

  const COLORS_BARRAS = ["#00C49F", "#FF4C4C"];

  // Gráfico de Pizza → Gastos por categoria
  const totalPorCategoria: Record<string, number> = {};
  transacoesFiltradas
    .filter((t) => t.tipo === "Saída")
    .forEach((t) => {
      totalPorCategoria[t.categoria] =
        (totalPorCategoria[t.categoria] || 0) + t.valor;
    });

  const dataPieChart = Object.entries(totalPorCategoria).map(([categoria, valor]) => ({
    name: categoria,
    value: valor,
  }));

  const COLORS_PIE = [
    "#FF6384", "#36A2EB", "#FFCE56", "#8A2BE2", "#FF7F50",
    "#00CED1", "#3CB371", "#FFD700", "#FF69B4", "#87CEEB"
  ];

  return (
    <>
      <PeriodoSelector />
      <div id="home-page">
        <h1>Bem-vindo{nomeUsuario ? `, ${nomeUsuario}` : ""}!</h1>
        <h3>Gerencie suas finanças pessoais de forma prática e organizada.</h3>
        <div className="faturas-cartoes">
          <h4>Cartões</h4>
          {faturasCartoes.length === 0 ? (
            <p className="sem-cartoes">Nenhum cartão cadastrado.</p>
          ) : (
            <div className="lista-cartoes">
              {faturasCartoes.map((f, i) => {
                const percentualUsado = f.limite > 0 ? (f.comprometido / f.limite) * 100 : 0;

                let corBarra = "#4CAF50"; // verde
                if (percentualUsado > 80) corBarra = "#FF4C4C"; // vermelho
                else if (percentualUsado > 50) corBarra = "#FFC107"; // amarelo

                return (
                  <div key={i} className="card-cartao">
                    <div className="header-cartao">
                      <h3>{f.cartao}</h3>
                    </div>

                    <div className="info-cartao">
                      <p><strong>Fatura atual:</strong> R$ {f.totalFaturaAtual.toFixed(2)}</p>
                      <p><strong>Limite total:</strong> R$ {f.limite.toFixed(2)}</p>
                      <p><strong>Comprometido:</strong> R$ {f.comprometido.toFixed(2)}</p>
                      <p><strong>Disponível:</strong> R$ {f.disponivel.toFixed(2)}</p>
                    </div>

                    <div className="barra-limite">
                      <div
                        className="progresso"
                        style={{ width: `${percentualUsado}%`, backgroundColor: corBarra }}
                      ></div>
                    </div>

                    <p className="percentual-uso">
                      {percentualUsado.toFixed(0)}% do limite utilizado
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="cards-container">
          <div className="card saldo">
            <p>Saldo: R$ {saldo.toFixed(2)}</p>
          </div>
          <div className="card transacoes">
            <p>Total de Transações: {numeroTransacoes}</p>
          </div>
          <div className="card maior-gasto">
            <p>Maior Gasto: R$ {maiorGasto.toFixed(2)}</p>
          </div>
        </div>

        <div className="graficos-relatorios">
          <div className="grafico-card-home">
            <h3>Entradas x Saídas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataBarChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="value" isAnimationActive>
                  {dataBarChart.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={COLORS_BARRAS[index % COLORS_BARRAS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grafico-card-home">
            <h3>Gastos por Categoria</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={dataPieChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: R$ ${(value ?? 0).toFixed(2)}`}
                >
                  {dataPieChart.map((entry, index) => (
                    <Cell key={`slice-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;