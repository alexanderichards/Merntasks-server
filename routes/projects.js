const express = require('express');
const router = express.Router()
const projectController = require("../controllers/projectController")
const { check } = require('express-validator')
const auth = require('../middleware/auth')

// create a project
router.post('/',
    [
        check('name', 'The name is required').not().isEmpty()
    ],
    auth,
    projectController.createProject
)

// get user projects
router.get('/', auth, projectController.getProjects)

// update a project
router.put('/:id',
    [
        check('name', 'The name is required').not().isEmpty()
    ],
    auth,
    projectController.updateProject
)


// delete a project
router.delete('/:id', auth, projectController.deleteProject)


// get project tasks 
router.get('/:id/tasks', auth, projectController.getProjectTasks)


module.exports = router