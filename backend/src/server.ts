import express from "express";
import path from "path";
import app from "./app";

const PORT = process.env.PORT || 4000;
const publicPath = path.join(__dirname, "public");

app.use(express.static(publicPath));

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
