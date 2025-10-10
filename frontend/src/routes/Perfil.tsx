import { useState, useEffect } from "react";
import axios from "axios";
import "./Perfil.css";

interface Usuario {
  id?: number;
  nome: string;
  email: string;
  rendaMensal: number;
  metaEconomia: number;
  foto?: string | null;
}

function Perfil() {
  const [usuario, setUsuario] = useState<Usuario>({
    nome: "",
    email: "",
    rendaMensal: 0,
    metaEconomia: 0,
  });

  const [novaFoto, setNovaFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [enviandoFoto, setEnviandoFoto] = useState(false);

  const [editando, setEditando] = useState(false);

  // Buscar usuário do backend
  useEffect(() => {
    axios.get("http://localhost:5000/usuarios")
      .then((res) => {
        if (res.data) setUsuario(res.data);
      })
      .catch((err) => console.error("Erro ao buscar usuário:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNovaFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };


  const salvarPerfil = async () => {
    try {
      if (usuario.id) {
        // Atualiza
        await axios.put(`http://localhost:5000/usuarios/${usuario.id}`, usuario);
      } else {
        // Cria
        const res = await axios.post("http://localhost:5000/usuarios", usuario);
        setUsuario(res.data);
      }
      setEditando(false);
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
    }
  };

  const enviarFoto = async () => {
    if (!usuario.id || !novaFoto) return;

    const formData = new FormData();
    formData.append("foto", novaFoto);

    try {
      setEnviandoFoto(true);
      const res = await axios.post(
        `http://localhost:5000/usuarios/${usuario.id}/foto`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setUsuario(res.data); // atualiza com o novo caminho da foto
      setPreview(null);
      setNovaFoto(null);
    } catch (err) {
      console.error("Erro ao enviar foto:", err);
    } finally {
      setEnviandoFoto(false);
    }
  };


  return (
    <div className="perfil-container">
      <h2>Perfil do Usuário</h2>

      <div className="perfil-foto-container">
        <img
          src={
            preview
              ? preview
              : usuario.foto
                ? `http://localhost:5000${usuario.foto}`
                : "/default-avatar.png"
          }
          alt="Foto de perfil"
          className="perfil-foto"
        />
        <label className="perfil-upload-label">
          📷 Alterar foto
          <input
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            className="perfil-input-file"
          />
        </label>

        {preview && (
          <button
            onClick={enviarFoto}
            className="btn-salvar-foto"
            disabled={enviandoFoto}
          >
            {enviandoFoto ? "Enviando..." : "Salvar nova foto"}
          </button>
        )}
      </div>


      <div className="perfil-card">
        <label>
          Nome:
          <input
            type="text"
            name="nome"
            value={usuario.nome}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>

        <label>
          E-mail:
          <input
            type="email"
            name="email"
            value={usuario.email}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>

        <label>
          Renda Mensal:
          <input
            type="number"
            name="rendaMensal"
            value={usuario.rendaMensal}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>

        <label>
          Meta de Economia:
          <input
            type="number"
            name="metaEconomia"
            value={usuario.metaEconomia}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>

        <div className="botoes-perfil">
          {editando ? (
            <button onClick={salvarPerfil} className="btn-salvar">
              💾 Salvar
            </button>
          ) : (
            <button onClick={() => setEditando(true)} className="btn-editar">
              ✏️ Editar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Perfil;