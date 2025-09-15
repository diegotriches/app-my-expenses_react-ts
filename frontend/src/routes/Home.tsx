import type { Transacao } from "../types/transacao";
import { useState } from "react";

import './Home.css'

interface Props {
  transacoes: Transacao[];
}

function Home({ transacoes }: Props) {
  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());

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

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <div id="home-container">
      <h2>Resumo do Mês</h2>

      <div className="filtros-periodo">
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

      <h3>{meses[mesSelecionado]} / {anoSelecionado}</h3>

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
    </div>
  );
}

export default Home;