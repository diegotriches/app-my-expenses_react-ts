import express from "express";
import sqlite3 from "sqlite3";

const router = express.Router();

// Banco de dados SQLite
const db = new sqlite3.Database("./finance.db", (err) => {
    if (err) console.error("Erro ao conectar ao banco", err.message);
    else console.log("Banco de dados (transacoes) conectado!");
});

// Listar todas as transações
router.get("/", (req, res) => {
    db.all("SELECT * FROM transacoes", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Adicionar transação
router.post("/", (req, res) => {
    let { data, tipo, descricao, valor, categoria, formaPagamento, parcela, recorrente, cartaoId } = req.body;

    // Normalizar formaPagamento
    const formasPermitidas = ["dinheiro", "pix", "cartao"];
    if (!formasPermitidas.includes(formaPagamento)) {
        formaPagamento = "dinheiro";
    }

    // Se não for "cartao", zera cartaoId
    if (formaPagamento !== "cartao") {
        cartaoId = null;
    }

    // Se for "cartao", precisa verificar se existe o cartão
    if (formaPagamento === "cartao" && !cartaoId) {
        return res.status(400).json({ error: "É necessário informar o cartaoId para formaPagamento = 'cartao'" });
    }

    if (formaPagamento === "cartao") {
        db.get("SELECT id FROM cartoes WHERE id = ?", [cartaoId], (err, cartao) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!cartao) {
                return res.status(400).json({ error: "Cartão informado não existe." });
            }

            inserirTransacao();
        });
    } else {
        inserirTransacao();
    }

    function inserirTransacao() {
        db.run(
            `INSERT INTO transacoes 
            (data, tipo, descricao, valor, categoria, formaPagamento, parcela, recorrente, cartaoId) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [data, tipo, descricao, valor, categoria, formaPagamento, parcela, recorrente ? 1 : 0, cartaoId],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({
                    id: this.lastID,
                    data,
                    tipo,
                    descricao,
                    valor,
                    categoria,
                    formaPagamento,
                    parcela,
                    recorrente,
                    cartaoId
                });
            }
        );
    }
});

// Atualizar transação
router.put("/:id", (req, res) => {
    const { id } = req.params;
    let { data, tipo, descricao, valor, categoria, formaPagamento, parcela, recorrente, cartaoId } = req.body;

    const formasPermitidas = ["dinheiro", "pix", "cartao"];
    if (!formasPermitidas.includes(formaPagamento)) {
        formaPagamento = "dinheiro";
    }

    if (formaPagamento !== "cartao") {
        cartaoId = null;
    }

    function atualizar() {
        db.run(
            `UPDATE transacoes 
            SET data = ?, tipo = ?, descricao = ?, valor = ?, categoria = ?, formaPagamento = ?, parcela = ?, recorrente = ?, cartaoId = ?
            WHERE id = ?`,
            [data, tipo, descricao, valor, categoria, formaPagamento, parcela, recorrente ? 1 : 0, cartaoId, id],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                if (this.changes === 0) {
                    return res.status(404).json({ error: "Transação não encontrada" });
                }
                res.json({
                    id: Number(id),
                    data,
                    tipo,
                    descricao,
                    valor,
                    categoria,
                    formaPagamento,
                    parcela,
                    recorrente,
                    cartaoId
                });
            }
        );
    }

    if (formaPagamento === "cartao" && cartaoId) {
        db.get("SELECT id FROM cartoes WHERE id = ?", [cartaoId], (err, cartao) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!cartao) return res.status(400).json({ error: "Cartão informado não existe." });
            atualizar();
        });
    } else {
        atualizar();
    }
});

// Excluir transação
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM transacoes WHERE id = ?", id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

export default router;