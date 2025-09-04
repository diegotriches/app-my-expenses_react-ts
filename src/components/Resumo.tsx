import './Resumo.css'

import React from "react";

interface Props {
  entradas: number;
  saidas: number;
  saldo: number;
}

const Resumo: React.FC<Props> = ({ entradas, saidas, saldo }) => {
  return (
    <div className="resumo">
      <h3>Resumo Financeiro</h3>
      <p className="entrada">Entradas: R$ {entradas.toFixed(2)}</p>
      <p className="saida">Saídas: R$ {Math.abs(saidas).toFixed(2)}</p>
      <p className={saldo >= 0 ? "positivo" : "negativo"}>
        Saldo: R$ {saldo.toFixed(2)}
      </p>
    </div>
  );
};

export default Resumo;