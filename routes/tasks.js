const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()
const taskController = require('../controllers/taskController')
const { check }= require('express-validator')


// create a task
router.post('/', 
    [
        check('name', 'The name is required').not().isEmpty(),
        check('project', 'The project is required').not().isEmpty(),
    ],auth, taskController.createTask)

// get project tasks
// router.get('/', 
//     auth,
//     taskController.getProjectTasks
// )

router.put('/:id', auth, taskController.updateTask)

router.delete('/:id', auth, taskController.deleteTask)

module.exports = router