import express from "express";
import path from "path";
import app from "./app";
import apiRoutes from "./modules/api.routes";
const PORT = process.env.PORT || 8080;

const publicPath = path.join(__dirname, "public");

app.use(express.static(publicPath));

app.use("/api", apiRoutes);

app.all("/*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
