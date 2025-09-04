import React, { useState, useEffect } from 'react'

import TransactionItem from './components/TransactionItem';
import Resumo from './components/Resumo';

import './App.css'

function App() {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number>(0);
  const [transacoes, setTransacoes] = useState<Transaction[]>([]);

  const removerTransacao = (id: number) => {
    setTransacoes(transacoes.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const data = localStorage.getItem("transacoes");
    if (data) {
      setTransacoes(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
  }, [transacoes]);


  const adicionarTransacao = (e: React.FormEvent) => {
    e.preventDefault();

    const novaTransacao: Transaction = {
      id: Date.now(),
      descricao,
      valor,
    };

    setTransacoes([...transacoes, novaTransacao]);
    setDescricao("");
    setValor(0);
  };

  interface Transaction {
    id: number;
    descricao: string;
    valor: number;
  }

  const totalEntradas = transacoes
    .filter(t => t.valor > 0)
    .reduce((acc, t) => acc + t.valor, 0);

  const totalSaidas = transacoes
    .filter(t => t.valor < 0)
    .reduce((acc, t) => acc + t.valor, 0);

  const saldo = totalEntradas + totalSaidas;


  return (
    <div>
      <h1>Meu gerenciador de gastos</h1>
      <form onSubmit={adicionarTransacao}>
        <input
          type="text"
          placeholder='Descrição'
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)} required
        />
        <input
          type="number"
          placeholder='Valor'
          value={valor}
          onChange={(e) => setValor(Number(e.target.value))} required
        />
        <button type='submit'>Adicionar</button>
      </form>
      <ul>
        {transacoes.map((t) => (
          <TransactionItem
            key={t.id}
            transaction={t}
            onDelete={removerTransacao} />
        ))}
      </ul>
      <Resumo
        entradas={totalEntradas}
        saidas={totalSaidas}
        saldo={saldo}
      />

    </div>
  );
}

export default App
