const Project = require("../models/Project")
const Task = require("../models/Task")
const { validationResult } = require('express-validator')

exports.createProject = async (req, res) => {

    // chech if there are any errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }


    try {
        const project = new Project(req.body)

        // save owner via jwt
        project.owner = req.body.user.id
        project.save()
        res.json(project)


    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong")
    }
}

exports.getProjects = async (req, res) => {

    const { user } = req.body
    try {
        // console.log(req.body)
        const projects = await Project.find({ owner: user.id }).sort({ registeredAt: -1 })
        res.json({ projects })
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong')
    }
}

exports.updateProject = async (req, res) => {

    // chech if there are any errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, user } = req.body

    const newProject = {}

    if (name) {
        newProject.name = name
    }

    try {
        // revisar el id
        let project = await Project.findById(req.params.id, (error, result) => {
            if (error) return
            return result
        })

        if (!project) res.status(404).json({ msg: 'Resource not found' })

        // si el projecto existe o no 


        // verificar el creador del proyecto
        if (project.owner.toString() !== user.id) res.status(401).json({ msg: 'Not authorized' })

        project = await Project.findOneAndUpdate({ _id: req.params.id }, { $set: newProject }, { new: true })

        res.json({ project })
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong")
    }
}

exports.deleteProject = async (req, res) => {

    const { user } = req.body


    try {
        // revisar el id
        let project = await Project.findById(req.params.id, (error, result) => {
            if (error) return
            return result
        })
        
        if (!project) res.status(404).json({ msg: 'Resource not found' })
        
        // si el projecto existe o no 


        // verificar el creador del proyecto
        if (project.owner.toString() !== user.id) res.status(401).json({ msg: 'Not authorized' })

        await Project.findOneAndRemove({ _id: req.params.id })

        res.json({ msg: "Project deleted" })
    } catch (error) {
        console.log(error)
        res.status(500).json('Something went wrong')
    }
}

exports.getProjectTasks = async (req, res) => {
    // Extraer el proyect y comprobar si existe
    const { user } = req.body
    // console.log(req.params)
    const { id : projectId } = req.params

    try{

        const project =  await Project.findById(projectId)
        if(!project) return res.status(404).json({msg: "Resource not found"})

        // check if the current project belongs to the auth user

        if (project.owner.toString() !== user.id) res.status(401).json({ msg: 'Not authorized' })

        // get all the projects where the project is equal to the project 
        const tasks = await Task.find({project : projectId}).sort({registeredAt: -1})

        res.json(tasks)


    } catch(error){
        console.log(error)
        res.status(500).send('Something went wrong')
    }
}