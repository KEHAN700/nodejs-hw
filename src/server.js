import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import pinoLogger from 'pino';

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  pino({
    logger: pinoLogger()
  })
);

const PORT = process.env.PORT || 3000;


app.get("/notes", (req, res) => {
  res.status(200).json({
    message: "Retrieved all notes",
  });
});

app.get("/notes/:noteId", (req, res) => {
  res.status(200).json({
    message: `Retrieved note with ID: ${req.params.noteId}`,
  });
});

app.get('/test-error', () => {
  throw new Error('Simulated server error');
});


app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});


app.use((err, req, res) => {
  res.status(500).json({
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});