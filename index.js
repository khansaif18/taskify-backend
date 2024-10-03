import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import taskRouter from './route/task.js'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.PORT

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error : ', err))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.use('/api/v1/task', taskRouter)

app.get('/', (req, res) => {
    res.json({ status: 'Yes, Getting!' })
})

app.listen(PORT, () => console.log('Yes, Listening on : ', PORT))