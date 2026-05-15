import { Joi, Segments } from "celebrate";
import mongoose from "mongoose";    
import { TAGS } from "../constants/tags.js";



const objectIdCustomValidator = (value, helpers) => {
  if (!mongoose.isValidObjectId(value)) {
    return helpers.message("Invalid note ID");
  }
  return value;
};




export const createNoteSchema = {
    [Segments.BODY]: Joi.object({
        title: Joi.string().trim().min(1).required(),
        content: Joi.string().trim().allow('').optional(),
        tag: Joi.string().valid(...TAGS).optional()
    })
};


export const getAllNotesSchema = {
    [Segments.QUERY]: Joi.object({
        page: Joi.number().integer().min(1).default(1), 
        perPage: Joi.number().integer().min(5).max(20).default(10),
        tag: Joi.string().valid(...TAGS).optional(), 
        search: Joi.string().trim().allow('').optional()
    })
};

export const noteIdSchema = {
    [Segments.PARAMS]: Joi.object({
        noteId: Joi.string().custom(objectIdCustomValidator).required()
    })
};

export const updateNoteSchema = {
    [Segments.PARAMS]: Joi.object({
        noteId: Joi.string().custom(objectIdCustomValidator).required()
    }),
    [Segments.BODY]: Joi.object({
        title: Joi.string().min(1).optional(),
    content: Joi.string().allow("").optional(),
    tag: Joi.string().valid(...TAGS).optional()
  }).or("title", "content", "tag") 
};