const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const taskSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  urgent: {
    type: Boolean,
    default: false,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  groupLinkedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  subTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subtask'
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

taskSchema.plugin(uniqueValidator);
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;