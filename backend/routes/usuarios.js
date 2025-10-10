import express from "express";
import sqlite3 from "sqlite3";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Configuração para __dirname no ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do multer (upload de imagens)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/")); // pasta onde será salva a imagem
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // nome único do arquivo
    },
});
const upload = multer({ storage });

// Banco de dados SQLite
const db = new sqlite3.Database("./finance.db", (err) => {
    if (err) console.error("Erro ao conectar ao banco", err.message);
    else console.log("Banco de dados (usuarios) conectado!");
});

// Obter usuário (assumindo que é apenas um por enquanto)
router.get("/", (req, res) => {
    db.get("SELECT * FROM usuarios LIMIT 1", [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row || null);
    });
});

// Criar usuário
router.post("/", (req, res) => {
    const { nome, email, rendaMensal, metaEconomia } = req.body;

    if (!nome || !email) {
        return res.status(400).json({ error: "Nome e e-mail são obrigatórios." });
    }

    db.run(
        `INSERT INTO usuarios (nome, email, rendaMensal, metaEconomia)
     VALUES (?, ?, ?, ?)`,
        [nome, email, rendaMensal || 0, metaEconomia || 0],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({
                id: this.lastID,
                nome,
                email,
                rendaMensal: rendaMensal || 0,
                metaEconomia: metaEconomia || 0,
                foto: null,
            });
        }
    );
});

// Upload de foto do usuário
router.post("/:id/foto", upload.single("foto"), (req, res) => {
    const { id } = req.params;
    const foto = req.file ? `/uploads/${req.file.filename}` : null;

    if (!foto) return res.status(400).json({ error: "Nenhuma foto enviada." });

    db.run("UPDATE usuarios SET foto = ? WHERE id = ?", [foto, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ sucesso: true, foto });
    });
});

// Atualizar dados do usuário
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { nome, email, rendaMensal, metaEconomia } = req.body;

    db.run(
        `UPDATE usuarios
     SET nome = ?, email = ?, rendaMensal = ?, metaEconomia = ?
     WHERE id = ?`,
        [nome, email, rendaMensal || 0, metaEconomia || 0, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            if (this.changes === 0) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            db.get("SELECT * FROM usuarios WHERE id = ?", [id], (err, row) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(row);
            });
        }
    );
});

export default router;