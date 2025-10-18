import { useEffect, useState } from "react";
import axios from "axios";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import type { Transacao } from "../types/transacao";

import "./Relatorios.css";

function Relatorios() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [anoSelecionado, setAnoSelecionado] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    axios.get("http://localhost:5000/transacoes")
      .then((res) => setTransacoes(res.data))
      .catch((err) => console.error("Erro ao carregar transações:", err));
  }, []);

  const transacoesAno = transacoes.filter((t) => new Date(t.data).getFullYear() === anoSelecionado);

  // ---- Totais gerais ----
  const totalEntradas = transacoesAno
    .filter((t) => t.tipo === "Entrada")
    .reduce((acc, t) => acc + t.valor, 0);

  const totalSaidas = transacoesAno
    .filter((t) => t.tipo === "Saída")
    .reduce((acc, t) => acc + t.valor, 0);

  const saldo = totalEntradas - totalSaidas;

  // ---- Totais por mês ----
  const meses = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];

  const totaisPorMes = meses.map((mes, index) => {
    const entradasMes = transacoesAno
      .filter((t) => new Date(t.data).getMonth() === index && t.tipo === "Entrada")
      .reduce((acc, t) => acc + t.valor, 0);

    const saidasMes = transacoesAno
      .filter((t) => new Date(t.data).getMonth() === index && t.tipo === "Saída")
      .reduce((acc, t) => acc + t.valor, 0);

    return {
      mes,
      entradas: entradasMes,
      saidas: saidasMes,
      saldo: entradasMes - saidasMes,
    };
  });

  // ---- Gastos por categoria ----
  const totalPorCategoria: Record<string, number> = {};
  transacoesAno
    .filter((t) => t.tipo === "Saída")
    .forEach((t) => {
      totalPorCategoria[t.categoria] = (totalPorCategoria[t.categoria] || 0) + t.valor;
    });

  const dataCategorias = Object.entries(totalPorCategoria).map(([categoria, valor]) => ({
    name: categoria,
    value: valor,
  }));

  // ---- Top 5 maiores gastos ----
  const topGastos = [...transacoesAno]
    .filter((t) => t.tipo === "Saída")
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 5);

  const COLORS = [
    "#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF",
    "#FF9F40", "#8A2BE2", "#3CB371", "#FF7F50", "#20B2AA"
  ];

  return (
    <div className="relatorios-container">
      <h2>Relatório Anual de {anoSelecionado}</h2>

      <div className="filtro-ano">
        <label htmlFor="ano">Ano: </label>
        <select
          id="ano"
          value={anoSelecionado}
          onChange={(e) => setAnoSelecionado(Number(e.target.value))}
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((ano) => (
            <option key={ano} value={ano}>{ano}</option>
          ))}
        </select>
      </div>

      <div className="resumo-anual">
        <div className="card resumo entradas">Entradas: R$ {totalEntradas.toFixed(2)}</div>
        <div className="card resumo saidas">Saídas: R$ {totalSaidas.toFixed(2)}</div>
        <div className="card resumo saldo">Saldo: R$ {saldo.toFixed(2)}</div>
      </div>

      <div className="graficos-container">
        <div className="grafico-card">
          <h3>Gastos por Mês</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={totaisPorMes} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="entradas" fill="#36A2EB" name="Entradas" />
              <Bar dataKey="saidas" fill="#FF6384" name="Saídas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grafico-card">
          <h3>Gastos por Categoria</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={dataCategorias}
                cx="50%"
                cy="50%"
                label={({ name, value }) => `${name}: R$ ${(value ?? 0).toFixed(2)}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {dataCategorias.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="tabela-resumo">
        <h3>Resumo Mensal</h3>
        <table>
          <thead>
            <tr>
              <th>Mês</th>
              <th>Entradas (R$)</th>
              <th>Saídas (R$)</th>
              <th>Saldo (R$)</th>
            </tr>
          </thead>
          <tbody>
            {totaisPorMes.map((m, i) => (
              <tr key={i}>
                <td>{m.mes}</td>
                <td>{m.entradas.toFixed(2)}</td>
                <td>{m.saidas.toFixed(2)}</td>
                <td>{m.saldo.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="top-gastos">
        <h3>Top 5 Maiores Gastos</h3>
        {topGastos.length === 0 ? (
          <p>Nenhum gasto registrado no ano.</p>
        ) : (
          <ul>
            {topGastos.map((t, i) => (
              <li key={i}>
                <strong>{t.descricao}</strong> — {t.categoria} — R$ {t.valor.toFixed(2)} ({new Date(t.data).toLocaleDateString("pt-BR")})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Relatorios;