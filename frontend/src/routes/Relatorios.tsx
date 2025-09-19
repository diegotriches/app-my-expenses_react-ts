import { useState } from 'react';
import type { Transacao } from '../types/transacao';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

import './Relatorios.css';

interface Props {
  transacoes: Transacao[];
}

function Relatorios({ transacoes }: Props) {
  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

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
    <div id='relatorios-container'>
      <h2>Relatórios do Mês</h2>

      <div className="filtros-relatorios">
        <select
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(Number(e.target.value))}
        >
          {meses.map((mes, index) => (
            <option key={index} value={index}>
              {mes}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={anoSelecionado}
          onChange={(e) => setAnoSelecionado(Number(e.target.value))}
        />
      </div>

      <div className="resumo-periodo">
        <strong>{meses[mesSelecionado]} / {anoSelecionado}</strong> — Entradas: R$ {totalEntradas.toFixed(2)}, Saídas: R$ {totalSaidas.toFixed(2)}
      </div>

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
  );
}

export default Relatorios