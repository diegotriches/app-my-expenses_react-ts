import { useState } from "react";

import Navbar from "./components/Navbar";
import Movimentacao from "./routes/Movimentacao";

import './App.css'

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: "Entrada" | "Saída";
  categoria: string;
}

function App() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  return (
    <div>
      <Navbar transacoes={transacoes} setTransacoes={setTransacoes} />
      <h1>App de Finanças</h1>
      <Movimentacao
      transacoes={transacoes}
      setTransacoes={setTransacoes}
      />
    </div>
  );
}

export default App
