const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Banco de dados SQLite
const db = new sqlite3.Database("./finance.db", (err) => {
    if (err) console.error("Erro ao conectar ao banco", err.message);
    else console.log("Banco conectado!");
});

 // Criar tabela se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS transacoes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT
    tipo TEXT,
    descricao TEXT,
    valor REAL,
    categoria TEXT
    )
    `);

    // Rotas
    app.get("/transacoes", (req, res) => {
        db.all("SELECT * FROM transacoes", [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    });

    app.post("/transacoes", (req, res) => {
        const { data, tipo, descricao, valor, categoria } = req.body;
        db.run(
            "INSERT INTO transacoes (data, tipo, descricao, valor, categoria) VALUES (?, ?, ?, ?, ?)",
            [data, tipo, descricao, valor, categoria],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ id: this.lastID, data, tipo, descricao, valor, categoria });
            }
        );
    });

    app.put("/transacoes/:id", (req, res) => {
        const { id } = req.params;
        const { data, tipo, descricao, valor, categoria } = req.body;

        db.run (
            "UPDATE transacoes SET data = ?, tipo = ?, descricao = ?, valor = ?, categoria = ? WHERE id = ?",
            [data, tipo, descricao, valor, categoria, id],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ id, data, tipo, descricao, valor, categoria });
            }
        );
    });

    app.delete("/transacoes/:id", (req, res) => {
        const { id } = req.params;
        db.run("DELETE FROM transacoes WHERE id = ?", id, function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ deleted: this.changes });
        });
    });

    // Servidor
    app.listen(5000, () => {
        console.log("Servidor rodando em http://localhost:5000")
    });