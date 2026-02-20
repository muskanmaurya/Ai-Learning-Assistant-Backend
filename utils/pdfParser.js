import fs from "fs/promises";
import {PDFParse} from "pdf-parse";

/**
 * Extract text from PDF file
 * @param {String} filePath - Path to PDF file
 * @return {Promise<{text: String, numPages:Number}>} - Extracted text and number of pages
 */

export const extractTextFromPDF=async(filePath)=>{
    try {
        const dataBuffer = await fs.readFile(filePath);
        //pdf- parse expects a unit 8 array, not a buffer
        const parser=new PDFParse(new Uint8Array(dataBuffer));
        const data= await parser.getText();

        return {
            text:data.text,
            numPages:data.numpages,
            info:data.info,
        }
    } catch (error) {
        console.log("PDF parsing error: ",error);
        throw new Error("Failed to extract text from PDF");      
    }
}