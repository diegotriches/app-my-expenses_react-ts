import type { Transacao } from "../App";

import './Resumo.css'

interface Props {
  transacoes: Transacao[];
}

function Resumo({ transacoes }: Props) {
  const entradas = transacoes
    .filter((t) => t.tipo === "Entrada")
    .reduce((acc, t) => acc + t.valor, 0);

  const saidas = transacoes
    .filter((t) => t.tipo === "Saída")
    .reduce((acc, t) => acc + t.valor, 0);

  const saldo = entradas - saidas;

  return (
    <div id="resumo-container">
      <h2>Resumo</h2>
      <p id="entradas">Entradas: R$ {entradas.toFixed(2)}</p>
      <p id="saidas">Saídas: R$ {saidas.toFixed(2)}</p>
      <p><strong>Saldo: R$ {saldo.toFixed(2)}</strong></p>
    </div>
  );
}

export default Resumo;
