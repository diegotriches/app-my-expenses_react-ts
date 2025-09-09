import { useState, useEffect } from "react";
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

  useEffect(() => { // Carrega o Local Storage ao iniciar
    const dadosSalvos = localStorage.getItem("transacoes");
    if (dadosSalvos) {
      setTransacoes(JSON.parse(dadosSalvos));
    }
  }, []);

  useEffect(() => { // Salva no Local Storage sempre que mudar
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
  }, [transacoes]);

  const adicionarTransacao = (nova: Transacao) => { // Adicionar transação
    setTransacoes((prev) => [...prev, nova]);
  };

  const editarTransacao = (atualizada: Transacao) => { // Editar transação
    setTransacoes((prev) => prev.map((t) => (t.id === atualizada.id ? atualizada : t))
    );
  };

  const excluirTransacao = (id: number) => {
    setTransacoes((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home transacoes={transacoes} />} />
          <Route
            path="/movimentacao"
            element={<Movimentacao
              transacoes={transacoes}
              adicionarTransacao={adicionarTransacao}
              editarTransacao={editarTransacao}
              excluirTransacao={excluirTransacao}
            />}
          />
          <Route path="/relatorios" element={<Relatorios transacoes={transacoes} />} />
          <Route path="/categorias" element={<Categorias />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
