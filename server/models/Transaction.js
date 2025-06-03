const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['CREDIT', 'DEBIT', 'TRANSFER', 'ADJUSTMENT'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  reference: String,
  category: String,
  paymentMethod: String,
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REVERSED'],
    default: 'PENDING'
  },
  attachments: [String],
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema); 