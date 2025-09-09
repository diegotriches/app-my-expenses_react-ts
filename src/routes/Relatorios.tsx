import { useState } from 'react';
import type { Transacao } from '../types/transacao';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, } from "recharts";

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

  const totalPorCategoria: Record<string, number> = {};
  transacoesFiltradas.forEach((t) => {
    if (!totalPorCategoria[t.categoria]) {
      totalPorCategoria[t.categoria] = 0;
    }
    totalPorCategoria[t.categoria] += t.valor;
  });

  return (
    <div id='relatorios-container'>
      <h3>Relatórios</h3>

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

      <h4 className='periodo-relatorio'>{meses[mesSelecionado]} / {anoSelecionado}</h4>

      <ul className='lista-categorias'>
        {Object.entries(totalPorCategoria).map(([cat, total]) => (
          <li key={cat}>
            {cat}: R$ {total.toFixed(2)}
          </li>
        ))}
      </ul>

      <div className="grafico-relatorio">
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
                <Cell key={entry.name} fill={["#00C49F", "#FF8042"][index % 2]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Relatorios