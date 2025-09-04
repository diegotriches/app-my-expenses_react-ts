import type { Transacao } from '../App';

import './Resumo.css'

function Resumo({ transacao }: { transacao: Transacao[] }) {
  const entradas = transacao
    .filter((t) => t.tipo === "Entrada")
    .reduce((acc, t) => acc + t.valor, 0);

  const saidas = transacao
    .filter((t) => t.tipo === "Saída")
    .reduce((acc, t) => acc + t.valor, 0);

  const saldo = entradas - saidas;

  return (
    <div id='resumo'>
      <h2>Resumo Financeiro</h2>
      <p id='entradas'>Entradas: R$ {entradas.toFixed(2)}</p>
      <p id='saidas'>Saídas: R$ {saidas.toFixed(2)}</p>
      <p style={{ fontWeight: "bold", color: saldo >= 0 ? "green" : "red" }}>
        Saldo: R$ {saldo.toFixed(2)}
      </p>
    </div>
  );
}
 export default Resumo