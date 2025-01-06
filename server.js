const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000; // Usa el puerto 3000 por defecto

// Middleware para parsear JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para permitir CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Ruta para manejar el envío de la encuesta
app.post("/submit-survey", (req, res) => {
  const data = req.body;

  // Guardar en archivo JSON
  fs.readFile("responses.json", "utf8", (err, fileData) => {
    let responses = [];
    if (!err && fileData) {
      responses = JSON.parse(fileData);
    }
    responses.push(data);

    fs.writeFile("responses.json", JSON.stringify(responses, null, 2), (err) => {
      if (err) {
        console.error("Error al guardar los datos:", err);
        return res.status(500).send("Error al guardar los datos.");
      }
      res.send("Respuesta guardada con éxito.");
    });
  });
});

// Ruta para obtener las respuestas guardadas
app.get("/responses", (req, res) => {
  fs.readFile("responses.json", "utf8", (err, fileData) => {
    if (err) {
      return res.status(500).send("No se pudieron cargar las respuestas.");
    }
    res.send(fileData);
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
