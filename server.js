import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import connectDB from "./config/db.js"
import errorHandler from './middleware/errorHandler.js'
import authRoutes from './routes/authRoutes.js'
import documentRoutes from "./routes/documentRoutes.js"

dotenv.config();

//initialize express app
const app=express();

//ES^ module __cirename alternative
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

//connect to mongodb
connectDB();

//middleware to handle cors
app.use(
    cors({
        origin:"*",
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"],
        credentials:true,
    })
)

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//static folder for uploads
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

//routes
app.use('/api/auth',authRoutes);
app.use("/api/documents",documentRoutes);

app.use(errorHandler);

//404 handler
app.use((req,res)=>{
   res.status(404).json({
    success:false,
    error:'Route not found',
    statusCode:404
   }) 
})

//start server
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
})


process.on('unhandledRejection',(err)=>{
    console.log(`Error: ${err.message}`);
    process.exit(1);
})