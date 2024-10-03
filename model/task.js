import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: 'No Description Given 🤷‍♂️'
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: String,
        required: true
    },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    }
})

export const Task = mongoose.model('task', taskSchema)