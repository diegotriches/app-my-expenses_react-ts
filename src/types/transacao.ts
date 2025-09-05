export interface Transacao {
    id: number;
    descricao: string;
    valor: number;
    tipo: "Entrada" | "Saída";
    categoria: string;
}