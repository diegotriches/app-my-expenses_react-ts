import { usePeriodo } from '../components/PeriodoContext';
import PeriodoSelector from "../components/PeriodoSelector";
import type { Transacao } from '../types/transacao';

import './Relatorios.css';

interface Props {
  transacoes: Transacao[];
}

function Relatorios({ transacoes }: Props) {
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

  return (
    <>
    
    </>
  );
}

export default Relatorios