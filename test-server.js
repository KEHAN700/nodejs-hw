import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.post('/test', async (req, res, next) => {
  console.log('Test route called');
  console.log('next type:', typeof next);
  try {
    res.json({ message: 'success' });
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.log('Error handler called');
  res.status(500).json({ message: err.message });
});

app.listen(3001, () => console.log('Test server on 3001'));
