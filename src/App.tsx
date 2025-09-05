import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./routes/Home";
import Movimentacao from "./routes/Movimentacao";
import Relatorios from "./routes/Relatorios";

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
    <BrowserRouter>
      <Navbar />
    <Routes>
                <Route path="/" element={<Home transacoes={transacoes}/>} />
                <Route
                    path="/movimentacao"
                    element={<Movimentacao transacoes={transacoes} setTransacoes={setTransacoes} />}
                />
                <Route path="/relatorios" element={<Relatorios />} />
            </Routes>
    </BrowserRouter>
  );
}

export default App
