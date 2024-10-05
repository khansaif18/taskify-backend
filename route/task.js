import { Router } from "express";
import { Task } from "../model/task.js";
import { checkUidInBody, checkUidInHeader, getTimeAndDate, taskLimiter } from "../middleware/index.js";


const taskRouter = Router()

// Route to get tasks created by user 
taskRouter.get('/user-tasks/:createdBy', checkUidInHeader, async (req, res) => {
    const createdBy = req.params.createdBy
    try {
        if (createdBy) {
            const userTasks = await Task.find({ createdBy: createdBy })
            if (userTasks) return res.status(200).json(userTasks)
            return new Error('No Tasks Found')
        } else {
            console.log('User ID is Required');
            return res.status(401).json({ error: 'User ID is Required' })
        }
    } catch (error) {
        return res.status(401).json(error.message)
    }
})

// Route a create a new task
taskRouter.post('/', checkUidInBody, async (req, res) => {
    const { title, description, createdBy } = req.body
    if (title, createdBy) {
        try {
            await Task.create({
                title,
                description,
                createdBy,
                createdAt: getTimeAndDate()
            })
            return res.status(201).json({ status: 'New Task Created' })
        } catch (error) {
            console.log('Could not create task : ', error);
            res.status(401).json({ error: 'Could not create task' })
        }
    } else {
        console.log('Missing Required Fields');
        return res.status(401).json({ error: 'Missing Required Fields' })
    }
})


// Route to update a task using id
taskRouter.put('/update/:id', checkUidInBody, async (req, res) => {
    const id = req.params.id;
    const { title, description } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            {
                title,
                description,
                updatedAt: getTimeAndDate()
            },
            { new: true }
        );
        if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
        return res.status(200).json({ status: 'Task Updated', updatedTask });

    } catch (error) {
        console.error('Could not update task: ', error);
        return res.status(500).json({ error: 'Could not update task' });
    }
});



// Route to toggle complete task using id
taskRouter.put('/toggle-complete/:id', checkUidInBody, async (req, res) => {
    const id = req.params.id;
    if (id) {
        try {
            const task = await Task.findById(id);
            if (!task) return res.status(404).json({ error: 'Task not found' });
            task.isCompleted = !task.isCompleted;
            await task.save();
            return res.status(200).json({ status: 'Task status toggled', task });
        } catch (error) {
            console.error('Could not toggle task status: ', error);
            return res.status(500).json({ error: 'Could not toggle task status' });
        }
    } else {
        console.log('Missing / Invalid Id');
        return res.status(400).json({ error: 'Missing / Invalid Id' });
    }
});


// Route to delete a task using id
taskRouter.delete('/delete/:id', checkUidInHeader, async (req, res) => {
    const id = req.params.id
    if (id) {
        try {
            await Task.findByIdAndDelete(id)
            return res.status(200).json({ status: 'Task Deleted' })
        } catch (error) {
            console.log('Could not delete task : ', error);
            res.status(401).json({ error: 'Could not delete task' })
        }
    } else {
        console.log('Id is Required');
        return res.status(401).json({ error: 'Id is Required' })
    }
})

// Route to find a task using id without authentication

// taskRouter.get('/:id', taskLimiter, async (req, res) => {
//     const id = req.params.id;
//     try {
//         const task = await Task.findById(id);
//         if (task) {
//             res.status(200).json(task);
//         } else {
//             res.status(404).json({ error: 'Could not find task' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Some error occurred, could not find task' });
//         console.log('Error:', error);
//     }
// });

// Route to list all task (for testings) 
// taskRouter.get('/',  async (req, res) => {
//     try {
//         const tasks = await Task.find({})
//         return tasks.length > 0 ? res.status(200).json({ tasks }) : res.status(200).json({ status: 'No Task Found' })
//     } catch (error) {
//         console.log('Could not list tasks : ', error);
//         res.status(401).json({ error: 'Could not list tasks' })
//     }
// })


export default taskRouter