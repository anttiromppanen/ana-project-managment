const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const subtaskSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  parentTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  userSubtaskPointedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  done: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

subtaskSchema.plugin(uniqueValidator);
const Subtask = mongoose.model('Subtask', subtaskSchema);

module.exports = Subtask;