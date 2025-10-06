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

// Criar tabelas se não existirem
db.run(`
    CREATE TABLE IF NOT EXISTS transacoes(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT,
        tipo TEXT,
        descricao TEXT,
        valor REAL,
        categoria TEXT,
        formaPagamento TEXT,
        parcela INTEGER,
        recorrente INTEGER,
        cartaoId INTEGER
    )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        tipo TEXT CHECK(tipo IN ('Entrada', 'Saída')) NOT NULL
    )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS cartoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    tipo TEXT,
    limite REAL,
    diaFechamento INTEGER,
    diaVencimento INTEGER
  )
`);

// Rotas
// Listar todas as transações
app.get("/transacoes", (req, res) => {
    db.all("SELECT * FROM transacoes", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Listar todas as categorias
app.get("/categorias", (req, res) => {
    db.all("SELECT * FROM categorias", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Listar todos os cartões
app.get("/cartoes", (req, res) => {
    db.all("SELECT * FROM cartoes", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Adicionar transação
app.post("/transacoes", (req, res) => {
    const { data, tipo, descricao, valor, categoria, formaPagamento, parcela, recorrente, cartaoId } = req.body;

    db.run(
        `INSERT INTO transacoes 
        (data, tipo, descricao, valor, categoria, formaPagamento, parcela, recorrente, cartaoId) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data, tipo, descricao, valor, categoria, formaPagamento, parcela, recorrente ? 1 : 0, cartaoId || null],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, data, tipo, descricao, valor, categoria, formaPagamento, parcela, recorrente, cartaoId });
        }
    );
});

// Adicionar categoria
app.post("/categorias", (req, res) => {
    const { nome, tipo } = req.body;

    if (!nome || !tipo) {
        return res.status(400).json({ erro: "Nome e tipo são obrigatórios" });
    }

    db.run(
        "INSERT INTO categorias (nome, tipo) VALUES (?, ?)",
        [nome, tipo],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, nome, tipo });
        }
    );
});

// Adicionar cartão
app.post("/cartoes", (req, res) => {
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

// Atualizar transação
app.put("/transacoes/:id", (req, res) => {
    const { id } = req.params;
    const { data, tipo, descricao, valor, categoria, formaPagamento, parcela, recorrente, cartaoId } = req.body;

    db.run(
        `UPDATE transacoes 
        SET data = ?, tipo = ?, descricao = ?, valor = ?, categoria = ?, formaPagamento = ?, parcela = ?, recorrente = ?, cartaoId = ? 
        WHERE id = ?`,
        [data, tipo, descricao, valor, categoria, formaPagamento, parcela, recorrente ? 1 : 0, cartaoId || null, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: Number(id), data, tipo, descricao, valor, categoria, formaPagamento, parcela, recorrente, cartaoId });
        }
    );
});

// Atualizar cartão
app.put("/cartoes/:id", (req, res) => {
    const { id } = req.params;
    const { nome, tipo, limite, diaFechamento, diaVencimento } = req.body;

    db.run(
        "UPDATE cartoes SET nome = ?, tipo = ?, limite = ?, diaFechamento = ?, diaVencimento = ? WHERE id = ?",
        [nome, tipo, limite, diaFechamento, diaVencimento, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: Number(id), nome, tipo, limite, diaFechamento, diaVencimento });
        }
    );
});

// Excluir transação
app.delete("/transacoes/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM transacoes WHERE id = ?", id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

// Excluir cartão
app.delete("/cartoes/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM cartoes WHERE id = ?", id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

// Servidor
app.listen(5000, () => {
    console.log("Servidor rodando em http://localhost:5000");
});