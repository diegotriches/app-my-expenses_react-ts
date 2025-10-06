export interface Transacao {
    id: number;
    data: string;
    descricao: string;
    valor: number;
    tipo: "Entrada" | "Saída";
    categoria: string;
    parcela?: string;
    recorrente?: boolean;
    formaPagamento: "credito" | "debito" | "dinheiro" | "pix";
    cartaoId?: number | null;
}