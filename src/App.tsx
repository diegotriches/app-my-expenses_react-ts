import React, { useState } from 'react'

import TransactionItem from './components/TransactionItem';

import './App.css'

function App() {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number>(0);

  const adicionarTransacao = (e: React.FormEvent) => {
    e.preventDefault();

    const novaTransacao: Transaction = {
      id:Date.now(),
      descricao,
      valor,
    };

    setTransacoes([...transacoes, novaTransacao]);
    setDescricao("");
    setValor(0);
  };

  interface Transaction {
    id:number;
    descricao: string;
    valor: number;
  }

  const [transacoes, setTransacoes] = useState<Transaction[]>([]);

  return (
    <div>
      <h1>Meu gerenciador de gastos</h1>
      <form onSubmit={adicionarTransacao}>
        <input type="text" placeholder='Descrição' value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
        <input type="number" placeholder='Valor' value={valor} onChange={(e) => setValor(Number(e.target.value))} required />
        <button type='submit'>Adicionar</button>
      </form>
      <ul>
        {transacoes.map((t) => (
            <TransactionItem key={t.id} transaction={t}/>
        ))}
      </ul>
    </div>
  );
}

export default App
