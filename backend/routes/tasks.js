const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  deleteCompletedTasks
} = require('../controllers/taskController');

router.route('/')
  .get(getTasks)
  .post(createTask)
  .delete(deleteCompletedTasks);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/toggle', toggleTask);

module.exports = router;
