import express from "express";
import sqlite3 from "sqlite3";

const router = express.Router();

// Banco de dados SQLite
const db = new sqlite3.Database("./finance.db", (err) => {
    if (err) console.error("Erro ao conectar ao banco", err.message);
    else console.log("Banco de dados (cartoes) conectado!");
});

// Listar todos os cartões
router.get("/", (req, res) => {
    db.all("SELECT * FROM cartoes", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Adicionar cartão
router.post("/", (req, res) => {
    const { nome, tipo, limite, diaFechamento, diaVencimento } = req.body;

    if (!nome || !tipo) {
        return res.status(400).json({ erro: "Nome e tipo são obrigatórios" });
    }

    db.run(
        "INSERT INTO cartoes (nome, tipo, limite, diaFechamento, diaVencimento) VALUES (?, ?, ?, ?, ?)",
        [nome, tipo, limite, diaFechamento, diaVencimento],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, nome, tipo, limite, diaFechamento, diaVencimento });
        }
    );
});

// Atualizar cartão
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { nome, tipo, limite, diaFechamento, diaVencimento } = req.body;

    db.run(
        "UPDATE cartoes SET nome = ?, tipo = ?, limite = ?, diaFechamento = ?, diaVencimento = ? WHERE id = ?",
        [nome, tipo, limite, diaFechamento, diaVencimento, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            if (this.changes === 0) {
                return res.status(404).json({ error: "Cartão não encontrado" });
            }

            res.json({ id: Number(id), nome, tipo, limite, diaFechamento, diaVencimento });
        }
    );
});

// Excluir cartão
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM cartoes WHERE id = ?", id, function (err) {
        if (err) return res.status(500).json({ error: err.message });

        if (this.changes === 0) {
            return res.status(404).json({ error: "Cartão não encontrado" });
        }

        res.json({ sucesso: true, id: Number(id) });
    });
});

export default router;