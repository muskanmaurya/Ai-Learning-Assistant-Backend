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
        if(!req.file){
            return res.status(400).json({
                success:false,
                error:"No file uploaded",
                statusCode:400
            });
        }

        const {title}=req.body;

        if(!title){
            //Delete uploaded file if no title provided
            await fs.unlink(req.file.path);
            return res.status(400).json({
                success:false,
                error:"Please provide a document title",
                statusCode:400
            });
        }

        //construct the URL for the uploading file
        const baseUrl=`https://localhost:${process.env.PORT||8000}`;
        const fileUrl =`${baseUrl}/uploads/documents/${req.file.filename}`;

        //create document record
        const document = await documentModel.create({
            userId:req.user.id,
            title,
            fileName:req.file.originalname,
            filePath:fileUrl, //store the URL instead of the local path
            fileSize:req.file.size,
            status:"processing"
        });

        //process PDF in background (in production, use a queue like Bull)
        
        
    } catch (error) {
        //clean up file on error
        if(req.file){
            await fs.unlink(req.file.path).catch(()=>{})
        }
        next(error);      
    }
}

// @desc get all user documents
// @route GET /api/documents
// @access Private

export const getDocuments=async(req ,res)=>{
    try {
        
    } catch (error) {
        //clean up file on error
        if(req.file){
            await fs.unlink(req.file.path).catch(()=>{})
        }
        next(error);      
    }
};

// @desc get single document with chunks
// @route GET /api/documents/:id
// @access Private

export const getDocument= async(req,res)=>{
    try {
        
    } catch (error) {
        //clean up file on error
        if(req.file){
            await fs.unlink(req.file.path).catch(()=>{})
        }
        next(error);      
    }

}

// @desc delete document
// @route DELETE /api/documents/:id
// @access Private

export const deleteDocument=async(req,res)=>{
    try {
        
    } catch (error) {
        //clean up file on error
        if(req.file){
            await fs.unlink(req.file.path).catch(()=>{})
        }
        next(error);      
    }
}

// @desc update document title
// @route PUT /api/documents/:id
// @access Private

export const updateDocument=async(req,res)=>{
    try {
        
    } catch (error) {
        //clean up file on error
        if(req.file){
            await fs.unlink(req.file.path).catch(()=>{})
        }
        next(error);      
    }

}

