import { useState, useEffect } from "react";
import type { Transacao } from "../types/transacao";

export function useTransacoes() {
    const [transacoes, setTransacoes] = useState<Transacao[]>(() => {
        const dados = localStorage.getItem("transacoes");
        return dados ? JSON.parse(dados) : [];
    });

    useEffect(() => {
        localStorage.setItem("transacoes", JSON.stringify(transacoes));
    }, [transacoes]);

    // Futuro backend
    const adicionarTransacao = async (nova: Transacao) => {
        setTransacoes(prev => [...prev, nova]);
    };

    const editarTransacao = async (atualizada: Transacao) => {
        setTransacoes(prev => prev.map(t => (t.id === atualizada.id ? atualizada : t)));
    };

    const excluirTransacao = async (id: number) => {
        setTransacoes(prev => prev.filter(t => t.id !== id));
    };

    return {
        transacoes,
        setTransacoes,
        adicionarTransacao,
        editarTransacao,
        excluirTransacao,
    };
}