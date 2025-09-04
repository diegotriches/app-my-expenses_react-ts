import { useTransacoes } from '../context/TransacoesContext'

import './Home.css'

const Home = () => {
  const { transacoes } = useTransacoes();

    const totalEntradas = transacoes
        .filter(t => t.valor > 0)
        .reduce((acc, t) => acc + t.valor, 0);

    const totalSaidas = transacoes
        .filter(t => t.valor < 0)
        .reduce((acc, t) => acc + t.valor, 0);

    const saldo = totalEntradas + totalSaidas;

    return (
        <div className="resumo">
            <h3>Resumo Financeiro</h3>
            <p className="entrada">Entradas: R$ {totalEntradas.toFixed(2)}</p>
            <p className="saida">Saídas: R$ {Math.abs(totalSaidas).toFixed(2)}</p>
            <p className={saldo >= 0 ? "positivo" : "negativo"}>
                Saldo: R$ {saldo.toFixed(2)}
            </p>
        </div>
    )
}

export default Home