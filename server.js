const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const videosFilePath = path.join(__dirname, 'videos.json');

// Middleware para parsear JSON
app.use(express.json());

// Middleware para servir archivos estáticos
app.use(express.static(__dirname));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/admin.html');
});

// Ruta para obtener los videos
app.get('/videos', (req, res) => {
  fs.readFile(videosFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      return res.status(500).send('Error al leer los videos.');
    }
    res.json(JSON.parse(data));
  });
});

// Ruta para guardar un nuevo video
app.post('/videos', (req, res) => {
  const newVideo = req.body;

  fs.readFile(videosFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      return res.status(500).send('Error al guardar el video.');
    }

    const videos = JSON.parse(data);
    videos.push(newVideo);

    fs.writeFile(videosFilePath, JSON.stringify(videos, null, 2), (err) => {
      if (err) {
        console.error('Error al escribir en el archivo:', err);
        return res.status(500).send('Error al guardar el video.');
      }
      res.status(201).send('Video guardado correctamente.');
    });
  });
});

// Ruta para borrar un video
app.delete('/videos/:id', (req, res) => {
  const videoId = req.params.id;

  fs.readFile(videosFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      return res.status(500).send('Error al borrar el video.');
    }

    let videos = JSON.parse(data);
    const initialLength = videos.length;
    videos = videos.filter(video => video.videoId !== videoId);

    if (videos.length === initialLength) {
      return res.status(404).send('Video no encontrado.');
    }

    fs.writeFile(videosFilePath, JSON.stringify(videos, null, 2), (err) => {
      if (err) {
        console.error('Error al escribir en el archivo:', err);
        return res.status(500).send('Error al borrar el video.');
      }
      res.status(200).send('Video borrado correctamente.');
    });
  });
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});