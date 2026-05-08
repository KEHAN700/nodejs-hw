import Note from '../models/note.js';
import createHttpError from 'http-errors';

export async function getAllNotes(req, res, next) {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
}

export async function getNoteById(req, res, next) {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);
    if (!note) {    
      return next(createHttpError(404, 'Note not found'));
    }
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
}


export async function createNote(req, res, next) {
  try {
    const { title, content, tag } = req.body;
    const newNote = new Note({ title, content, tag });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
}

export async function deleteNote(req, res, next) {
  try {
    const { noteId } = req.params;
    const deletedNote = await Note.findByIdAndDelete(noteId);
    if (!deletedNote) {
      return next(createHttpError(404, 'Note not found'));
    }
    res.status(200).json(deletedNote);
  } catch (error) {
    next(error);
  }
}

export async function updateNote(req, res, next) {
  try {
    const { noteId } = req.params;
    const { title, content, tag } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, content, tag },
      {
        returnDocument: 'after',
        runValidators: true,
      },
    );

    if (!updatedNote) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
}
