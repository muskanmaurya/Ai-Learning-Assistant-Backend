import documentModel from "../models/Document.js";
import flashcardModel from "../models/Flashcard.js";
import quizModel from "../models/Quiz.js";
import {extractTextFromPDF} from "../utils/pdfParser.js"
import fs from "fs/promises";
import mongoose from "mongoose";

// @desc upload and process document
// @route POST /api/documents/upload
// @access Private

export const uploadDocument =async(req ,res ,next)=>{
    try {
        
    } catch (error) {
        //clean up file on error
        if(req.file){
            await fs.unlink(req.file.path).catch(()=>{})
        }
        next(error);
        
    }
}

