import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import router from './routes/authRoutes.js'

dotenv.config();

await connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send("backend running properly")
})
app.use('/api/auth', router)

//global error hander
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({success : false, message : err.message  || 'internal server error'})
})

app.listen(PORT, () => {
    console.log(`server is running on port:${PORT}`)
})