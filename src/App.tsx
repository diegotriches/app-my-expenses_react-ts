import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import type { Transacao } from './types/transacao'

import Navbar from "./components/Navbar";
import Home from "./routes/Home";
import Movimentacao from "./routes/Movimentacao";
import Relatorios from "./routes/Relatorios";
import Categorias from "./routes/Categorias";

import './App.css'

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
                <Route path="/relatorios" element={<Relatorios transacoes={transacoes} />} />
                <Route path="/categorias" element={<Categorias/>} />
            </Routes>
    </BrowserRouter>
  );
}

export default App
