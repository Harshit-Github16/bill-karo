const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['BANK', 'CASH', 'RECEIVABLE', 'PAYABLE'],
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Account = mongoose.models.Account || mongoose.model('Account', accountSchema);

module.exports = { Account }; 