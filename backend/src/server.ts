import app from "./app";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  const host = process.env.HOST || "localhost";
  console.log(`Servidor backend iniciado en http://${host}:${PORT}`);
});
