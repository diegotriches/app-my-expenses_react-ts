import express from "express";
import sqlite3 from "sqlite3";

const router = express.Router();

// Banco de dados SQLite
const db = new sqlite3.Database("./finance.db", (err) => {
    if (err) console.error("Erro ao conectar ao banco", err.message);
    else console.log("Banco de dados (categorias) conectado!");
});

// Listar categorias
router.get("/", (req, res) => {
    db.all("SELECT * FROM categorias", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Criar nova categoria
router.post("/", (req, res) => {
    const { nome, tipo } = req.body;
    
    if (!nome || !tipo) {
        return res.status(400).json({ erro: "Nome e tipo são obrigatórios" });
    }
    
    db.run(
        "INSERT INTO categorias (nome, tipo) VALUES (?, ?)",
        [nome, tipo],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, nome, tipo });
        }
    );
});

// Editar categoria
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, tipo } = req.body;

  if (!nome || !tipo) {
    return res.status(400).json({ erro: "Nome e tipo são obrigatórios" });
  }

  db.run(
    "UPDATE categorias SET nome = ?, tipo = ? WHERE id = ?",
    [nome, tipo, id],
    function (err) {
      if (err) {
        console.error("Erro ao atualizar categoria:", err.message);
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      res.json({ id: Number(id), nome, tipo });
    }
  );
});

// Excluir categoria
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM categorias WHERE id = ?", id, function (err) {
    if (err) {
      console.error("Erro ao excluir categoria:", err.message);
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    res.json({ sucesso: true, id: Number(id) });
  });
});

export default router;