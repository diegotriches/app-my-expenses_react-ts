import axios from "axios";

const api = axios.create({
  baseURL: process.env.NODE_ENV === "electron"
    ? "http://127.0.0.1:5000" // backend interno do Electron
    : "http://localhost:5000" // para rodar via `npm run dev`
});

export default api;