import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { logger } from './middleware/logger.js';
import cors from 'cors';
import { connectMongoDB } from './db/connectMongoDB.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from "./routes/notesRoutes.js";
import { errors } from "celebrate";


await connectMongoDB();

const app = express();
app.use(logger);
app.use(express.json());
app.use(cors());
app.use("/notes", notesRouter);
app.use(notFoundHandler); 
app.use(errors());
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
