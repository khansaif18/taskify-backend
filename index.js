import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { userRoute } from './routes/user.js';
import { urlRoute } from './routes/url.js';
import cookieParser from 'cookie-parser';
import { checkForAuthenticationCookie } from './middlewares/authentication.js';
import dotenv from 'dotenv'
import { shortRoute } from './routes/short.js';

dotenv.config()
const app = express()
const PORT = process.env.PORT

mongoose.connect(process.env.MONGO_LOCAL_SERVER)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log('MongoDB Connection Error', err));


// Middlewares
app.use(cors({
    origin: 'https://linktrim-saif.vercel.app',
    credentials: true
}));

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

app.use('/short', shortRoute)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/url', checkForAuthenticationCookie('token'), urlRoute)

app.get('/api', (req, res) => {
    res.json({ status: 'done scene hai' })
})

app.listen(PORT, () => {
    console.log(`Server is Runnig at Port : http://localhost:${PORT}`);
})

