import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

import transacoesRoutes from "./routes/transacoes.js";
import cartoesRoutes from "./routes/cartoes.js";
import categoriasRoutes from "./routes/categorias.js";
import usuariosRoutes from "./routes/usuarios.js";

const app = express();
app.use(cors());
app.use(express.json());

// Necessário para __dirname no ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir imagens da pasta uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Usando as rotas separadas
app.use("/transacoes", transacoesRoutes);
app.use("/cartoes", cartoesRoutes);
app.use("/categorias", categoriasRoutes);
app.use("/usuarios", usuariosRoutes);

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

db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    rendaMensal REAL DEFAULT 0,
    metaEconomia REAL DEFAULT 0,
    foto TEXT
  )
`);


// Servidor
app.listen(5000, () => console.log("Servidor rodando em http://localhost:5000"));