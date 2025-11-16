import express from "express";
import path from "path";
import app from "./app";

// Puerto
const PORT = process.env.PORT || 4000;

const publicPath = path.join(__dirname, "public");

app.use(express.static(publicPath));

app.get("/*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor monolito escuchando en puerto ${PORT}`);
});
