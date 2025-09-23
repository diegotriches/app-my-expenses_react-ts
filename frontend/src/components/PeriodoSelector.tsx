import { usePeriodo } from "./PeriodoContext";

import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";

import './PeriodoSelector.css';

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function PeriodoSelector() {
  const { mesSelecionado, setMesSelecionado, anoSelecionado, setAnoSelecionado } = usePeriodo();

  const avancarMes = () => {
    if (mesSelecionado === 11) {
      setMesSelecionado(0);
      setAnoSelecionado(anoSelecionado + 1);
    } else {
      setMesSelecionado(mesSelecionado + 1);
    }
  };

  const voltarMes = () => {
    if (mesSelecionado === 0) {
      setMesSelecionado(11);
      setAnoSelecionado(anoSelecionado - 1);
    } else {
      setMesSelecionado(mesSelecionado - 1);
    }
  };

  return (
    <div className="periodo-compact">
      <button className="seta" onClick={voltarMes}><BsCaretLeftFill /></button>
      <span className="periodo-texto">{meses[mesSelecionado]} / {anoSelecionado}</span>
      <button className="seta" onClick={avancarMes}><BsCaretRightFill /></button>
    </div>
  );
}

export default PeriodoSelector;