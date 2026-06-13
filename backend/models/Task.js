const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a task title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  details: {
    type: String,
    default: '',
    maxlength: [1000, 'Details cannot be more than 1000 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    default: null
  },
  // NEW FIELDS FOR Y2K REDESIGN:
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  order: {
    type: Number,
    default: 0 // Needed for drag-and-drop sorting
  },
  subtasks: [{
    title: String,
    completed: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);