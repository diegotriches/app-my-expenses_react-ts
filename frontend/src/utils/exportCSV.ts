import type { Transacao } from "../types/transacao";

export function exportarCSV (transacoes: Transacao[], nomeArquivo = "movimentacoes.csv") {
    if (transacoes.length === 0) {
        alert("Não há movimentações para exportar.");
        return;
    }

    const headers = ["ID", "Data", "Tipo", "Descrição", "Valor", "Categoria", "Forma de Pagamento", "Parcela", "Recorrente"];

    const linhas = transacoes.map((t) => [
        t.id, t.data, t.tipo, t.descricao, t.valor.toString().replace(".", ","), t.categoria, t.formaPagamento, t.parcela || "", t.recorrente ? "Sim" : "Não",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...linhas.map((linha) => linha.join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", nomeArquivo);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}