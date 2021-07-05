const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const groupSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participiants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

groupSchema.plugin(uniqueValidator);
const Group = mongoose.model('Group', groupSchema);

module.exports = Group;