import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import db_connection from './utils/db.js';
import companyRoutes from './routes/companyRoutes.js';

dotenv.config();

const app = express()

app.use(cors());
app.use(express.json());

// connecting to data base
db_connection()


app.use("/api", companyRoutes);

app.listen(process.env.PORT,()=>{
    console.log('back-end server'+"\n port:"+process.env.PORT)
})