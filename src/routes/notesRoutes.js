import { Router } from "express";
import { celebrate } from "celebrate";
import {
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
  getNotes 
} from "../controllers/notesController.js";
import { 
getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema
} from "../validations/notesValidation.js"; 

const notesRouter = Router();
notesRouter.get("/", celebrate(getAllNotesSchema), getNotes);
notesRouter.get("/:noteId", celebrate(noteIdSchema), getNoteById);
notesRouter.post("/", celebrate(createNoteSchema), createNote);
notesRouter.delete("/:noteId", celebrate(noteIdSchema), deleteNote);
notesRouter.patch("/:noteId", celebrate(updateNoteSchema), updateNote);

export default notesRouter;