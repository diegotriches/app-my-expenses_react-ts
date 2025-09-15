import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

import type { Transacao } from './types/transacao'
import Navbar from "./components/Navbar";
import Home from "./routes/Home";
import Movimentacao from "./routes/Movimentacao";
import Relatorios from "./routes/Relatorios";
import Categorias from "./routes/Categorias";

function App() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  useEffect(() => { // Carrega o Banco de Dados ao iniciar
    axios
      .get("http://localhost:5000/transacoes")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTransacoes(res.data);
        } else {
          console.error("Resposta ineseperada do backend:", res.data);
          setTransacoes([]);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar transações:", err);
        setTransacoes([]);
      });
  }, []);

  const adicionarTransacao = async (nova: Transacao) => { // Adicionar transação
    const res = await axios.post("http://localhost:5000/transacoes", nova);
    setTransacoes(prev => [...prev, res.data]);
  };

  const editarTransacao = async (atualizada: Transacao) => { // Editar transação
    const res = await axios.put(`http://localhost:5000/transacoes/${atualizada.id}`, atualizada);
    setTransacoes(prev => prev.map((t) => (t.id === atualizada.id ? res.data : t))
    );
  };

  const excluirTransacao = async (id: number) => {
    await axios.delete(`http://localhost:5000/transacoes/${id}`);
    setTransacoes(prev => prev.filter(t => t.id !== id));
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
