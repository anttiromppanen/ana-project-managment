const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
  },
  passwordHash: {
    type: String,
    required: true,
    minlength: 5,
  },
  yearsInOrganization: {
    type: String,
    minlength: 3,
    required: true,
  },
  position: {
    type: String,
    minlength: 3,
    required: true,
  },
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
  ],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
  subtasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subtask',
    },
  ],
});

userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);

module.exports = User;