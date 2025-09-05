export interface Transacao {
    id: number;
    data: string;
    descricao: string;
    valor: number;
    tipo: "Entrada" | "Saída";
    categoria: string;
}