import React from "react";

interface Transaction {
    id: number;
    descricao: string;
    valor: number;
}

interface Props {
    transaction: Transaction;
    onDelete: (id: number) => void;
}

const TransactionItem: React.FC<Props> = ({transaction, onDelete }) => {
    const classeValor = transaction.valor >= 0 ? "entrada" : "saida";

    return (
        <li>
            {transaction.descricao} <span className={classeValor}>R$ {transaction.valor.toFixed(2)}</span>{""}
            <button onClick={() => onDelete(transaction.id)}>❌</button>
        </li>
    );
}

export default TransactionItem;