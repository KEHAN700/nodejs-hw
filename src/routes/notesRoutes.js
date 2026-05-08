import express from 'express';
import { getAllNotes, getNoteById, createNote, deleteNote, updateNote } from '../controllers/notesController.js';

export const notesRouter = express.Router();

notesRouter.get('/notes', getAllNotes);
notesRouter.get('/notes/:noteId', getNoteById);
notesRouter.post('/notes', createNote);
notesRouter.delete('/notes/:noteId', deleteNote);
notesRouter.patch('/notes/:noteId', updateNote);