import express from "express";
import path from "path";
import app from "./app";

const PORT = process.env.PORT || 8080;

const publicPath = path.join(__dirname, "../public");

app.use(express.static(publicPath));

app.use("/api", require("./modules/api.routes"));

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
