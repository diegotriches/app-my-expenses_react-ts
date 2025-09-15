export let categoriasEntrada: string[] = [
    "Salário",
    "Investimentos",
    "Reembolso",
    "Outros",
];

export let categoriasSaida: string[] = [
    "Alimentação",
    "Transporte",
    "Moradia",
    "Lazer",
    "Educação",
    "Saúde",
];

export function adicionarCategoria(tipo: "Entrada" | "Saída", categoria: string) {
    if (tipo === "Entrada" && !categoriasEntrada.includes(categoria)) {
        categoriasEntrada = [...categoriasEntrada, categoria];
    } else if (tipo === "Saída" && !categoriasSaida.includes(categoria)) {
        categoriasSaida = [...categoriasSaida, categoria];
    }
}