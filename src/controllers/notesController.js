import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

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

export async function getAllNotes(req, res, next) {
  try {
    const { tag, search, page = 1, perPage = 10 } = req.query;

    // Побудова запиту через ланцюжок методів Mongoose
    let notesQuery = Note.find();

    if (tag) {
      notesQuery = notesQuery.where('tag').equals(tag);
    }
    
    if (search) {
      notesQuery = notesQuery.or([
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]);
    }

    // Підрахунок загальної кількості нотаток з тими ж фільтрами
    const countQuery = Note.find();
    if (tag) {
      countQuery.where('tag').equals(tag);
    }
    if (search) {
      countQuery.or([
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]);
    }
    const totalNotes = await countQuery.countDocuments();

    // Обчислення пагінації
    const skip = (page - 1) * perPage;
    const totalPages = Math.ceil(totalNotes / perPage);

    // Застосування пагінації та сортування
    notesQuery = notesQuery
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage);

    const notes = await notesQuery;

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalNotes,
      totalPages,
      notes
    });
    
  } catch (error) {
    next(error);
  }
}
