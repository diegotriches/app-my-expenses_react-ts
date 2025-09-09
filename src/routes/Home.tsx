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

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <div id="resumo-container">
      <h2>Resumo Financeiro</h2>

      <div className="filtros">
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
        <div className="card entradas">
          <p id="entradas">Entradas: R$ {totalEntradas.toFixed(2)}</p>
        </div>
        <div className="card saidas">
          <p id="saidas">Saídas: R$ {totalSaidas.toFixed(2)}</p>
        </div>
        <div className="card saldo">
          <p><strong>Saldo: R$ {saldo.toFixed(2)}</strong></p>
        </div>
      </div>
    </div>
  );
}

export default Home;