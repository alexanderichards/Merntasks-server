const Task = require("../models/Task")
const Project = require("../models/Project")

const { validationResult } = require('express-validator')
const { findByIdAndUpdate } = require("../models/Task")

exports.createTask = async (req, res) => {
    // chech if there are any errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Extraer el proyect y comprobar si existe
    const { project : projectId, user } = req.body

    try{

        const project =  await Project.findById(projectId)
        if(!project) return res.status(404).json({msg: "Resource not found"})

        // check if the current project belongs to the auth user

        if (project.owner.toString() !== user.id) res.status(401).json({ msg: 'Not authorized' })

        // if everything is ok then we create the task

        const task = new Task(req.body)
        await task.save()

        res.json({task})

    } catch(error){
        console.log(error)
        res.status(500).send('Something went wrong')
    }
}

// exports.getProjectTasks = async (req, res) => {
//     // Extraer el proyect y comprobar si existe
//     const { project : projectId, user } = req.body

//     try{

//         const project =  await Project.findById(projectId)
//         if(!project) return res.status(404).json({msg: "Resource not found"})

//         // check if the current project belongs to the auth user

//         if (project.owner.toString() !== user.id) res.status(401).json({ msg: 'Not authorized' })

//         // get all the projects where the project is equal to the project 
//         const tasks = await Task.find({project : projectId})

//         res.json(tasks)


//     } catch(error){
//         console.log(error)
//         res.status(500).send('Something went wrong')
//     }
// }

exports.updateTask = async (req, res) => {

    // Extraer el proyect y comprobar si existe

    const { project : projectId, name, status, user } = req.body


    try {
        
        let task = await Task.findById(req.params.id)

        if(!task) return res.status(404).json({msg: "The task does not exist"})

        const project =  await Project.findById(projectId)
        if(!project) return res.status(404).json({msg: "Resource not found (Project)"})

        // check if the current project belongs to the auth user
        // console.log(projectId)
        // console.log(task.project)

        if (project.owner.toString() !== user.id) return res.status(401).json({ msg: 'Not authorized' })

        if(projectId != task.project) return res.status(401).json({ msg: 'Not authorized to update this project task'})

        // create a new task wit the new info
        let newTask = {}

        if(name != undefined) newTask.name = name

        // console.log(completed)
        // console.log(name)
        if(status != undefined) newTask.status = status

        // console.log(newTask)


        // save the updates tothe task

        const updatedTask = await Task.findOneAndUpdate({_id: req.params.id}, { $set: newTask }, {new: true})

        res.json({task: updatedTask})

        
    } catch (error) {
        console.log(error)
        res.status(500).send('Something went wrong')
    }
}

exports.deleteTask = async (req, res) => {
    // Extraer el proyect y comprobar si existe

    const { user } = req.body
    const { project: projectId} = req.query

    // console.log(projectId)

    try {
        
        let task = await Task.findById(req.params.id)

        if(!task) return res.status(404).json({msg: "The task does not exist"})

        const project =  await Project.findById(projectId)
        if(!project) return res.status(404).json({msg: "Resource not found (Project)"})

        // check if the current project belongs to the auth user
        // console.log(projectId)
        // console.log(task.project)

        if (project.owner.toString() !== user.id) return res.status(401).json({ msg: 'Not authorized' })

        if(projectId != task.project) return res.status(401).json({ msg: 'Not authorized to delete this project task'})

        await Task.findOneAndRemove({_id: req.params.id})

        res.json({msg: "Task deleted"})
        
    } catch (error) {
        console.log(error)
        res.status(500).send('Something went wrong')
    }
}