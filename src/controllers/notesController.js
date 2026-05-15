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
    const query = {}; 

    if (tag) {
      query.tag = tag;
    }
    
    if (search) {
      query.$text = { $search: search };
    } 

    // Підрахунок загальної кількості нотаток
    const totalNotes = await Note.countDocuments(query);

    // Обчислення пагінації
    const skip = (page - 1) * perPage;
    const totalPages = Math.ceil(totalNotes / perPage);

    let notesQuery = Note.find(query)
      .skip(skip)
      .limit(perPage);

    if (search) {
      notesQuery = notesQuery
        .select({ score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } });
    } else {
      notesQuery = notesQuery.sort({ createdAt: -1 });
    }

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
