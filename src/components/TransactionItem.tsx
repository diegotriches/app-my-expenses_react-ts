import React from "react";

interface Transaction {
    id: number;
    descricao: string;
    valor: number;
}

interface Props {
    transaction: Transaction;
}

const TransactionItem: React.FC<Props> = ({transaction}) => {
    return (
        <li>
            {transaction.descricao}: R$ {transaction.valor.toFixed(2)}
        </li>
    );
}

export default TransactionItem;