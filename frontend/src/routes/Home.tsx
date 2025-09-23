import { usePeriodo } from '../components/PeriodoContext';
import type { Transacao } from "../types/transacao";
import PeriodoSelector from "../components/PeriodoSelector";

import './Home.css'

interface Props {
  transacoes: Transacao[];
}

function Home({ transacoes }: Props) {
  const { mesSelecionado, anoSelecionado } = usePeriodo();

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

  return (
    <div id="home-container">
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
    </div>
  );
}

export default Home;