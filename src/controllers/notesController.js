import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export async function getNoteById(req, res, next) {
  try {
    const { noteId } = req.params;

    const note = await Note.findOne({
      _id: noteId,
      userId: req.user._id,
    });

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

    const newNote = new Note({
      title,
      content,
      tag,
      userId: req.user._id,
    });

    const savedNote = await newNote.save();

    res.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
}

export async function deleteNote(req, res, next) {
  try {
    const { noteId } = req.params;

    const deletedNote = await Note.findOneAndDelete({
      _id: noteId,
      userId: req.user._id,
    });

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

    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: noteId,
        userId: req.user._id,
      },
      {
        title,
        content,
        tag,
      },
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

    let notesQuery = Note.find({
      userId: req.user._id,
    });

    if (tag) {
      notesQuery = notesQuery.where('tag').equals(tag);
    }

    if (search) {
      notesQuery = notesQuery.or([
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ]);
    }

    const countQuery = Note.find({
      userId: req.user._id,
    });

    if (tag) {
      countQuery.where('tag').equals(tag);
    }

    if (search) {
      countQuery.or([
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ]);
    }

    const totalNotes = await countQuery.countDocuments();

    const skip = (page - 1) * perPage;

    const totalPages = Math.ceil(totalNotes / perPage);

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
      notes,
    });
  } catch (error) {
    next(error);
  }
}