import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

import type { Transacao } from './types/transacao'
import { PeriodoProvider } from "./components/PeriodoContext";

import Navbar from "./components/Navbar";
import Home from "./routes/Home";
import Movimentacao from "./routes/Movimentacao";
import Relatorios from "./routes/Relatorios";
import Perfil from "./routes/Perfil";
import Categorias from "./routes/Categorias";
import Cartoes from "./routes/Cartoes";
import FormMovimentacao from "./routes/FormMovimentacao";
import FloatingButton from "./components/FloatingButton";
import Historico from "./routes/Historico";

function App() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/transacoes")
      .then((res) => {
        if (Array.isArray(res.data)) setTransacoes(res.data);
        else {
          console.error("Resposta inesperada do backend:", res.data);
          setTransacoes([]);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar transações:", err);
        setTransacoes([]);
      });
  }, []);

  // Adicionar nova transação
  const adicionarTransacao = async (nova: Transacao) => {
    try {
      const res = await axios.post("http://localhost:5000/transacoes", nova);
      setTransacoes(prev => [...prev, res.data]);
    } catch (err) {
      console.error("Erro ao adicionar transação:", err);
    }
  };

  // Editar transação existente
  const editarTransacao = async (atualizada: Transacao) => {
    try {
      const res = await axios.put(`http://localhost:5000/transacoes/${atualizada.id}`, atualizada);
      setTransacoes(prev => prev.map(t => t.id === atualizada.id ? res.data : t));
    } catch (err) {
      console.error("Erro ao editar transação:", err);
    }
  };

  // Excluir transação
  const excluirTransacao = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/transacoes/${id}`);
      setTransacoes(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Erro ao excluir transação:", err);
    }
  };

  return (
    <div>
      <PeriodoProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home transacoes={transacoes} />} />
            <Route
              path="/movimentacao"
              element={<Movimentacao
                transacoes={transacoes}
                excluirTransacao={excluirTransacao}
              />}
            />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route
              path="/form-movimentacao/:id?"
              element={<FormMovimentacao
                transacoes={transacoes}
                adicionarTransacao={adicionarTransacao}
                editarTransacao={editarTransacao}
              />}
            />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/cartoes" element={<Cartoes />} />
            <Route path="/historico" element={<Historico />} />
          </Routes>
          <FloatingButton />
        </BrowserRouter>
      </PeriodoProvider>
    </div>
  );
}

export default App;