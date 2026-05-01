require('dotenv').config()
const express = require('express')
const app = express();
const cors = require('cors')
const pino = require('pino-http')({
  logger: require('pino')()
});
app.use(express.json());
app.use(pino);
app.use(cors());    
const PORT = process.env.PORT || 3000;

app.get("/notes", (req, res) => {
  res.status(200).json({
    message: "Retrieved all notes",
  });
});

app.get("/notes/:noteId", (req, res) => {
    res.status(200).json({
        "message": `Retrieved note with ID: ${req.params.noteId}`
    });
});


app.get('/test-error', () => {
  throw new Error('Simulated server error');
});



app.use((req, res) => {
    res.status(404).json({
        "message": "Route not found"
    });
});

app.use((err, req, res) => {  
    res.status(500).json({
        "message": err.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});