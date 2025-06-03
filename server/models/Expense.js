const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'CANCELLED', 'REFUNDED'],
    default: 'PENDING'
  },
  receipt: {
    type: String
  },
  vendor: {
    name: String,
    gstNumber: String,
    panNumber: String
  },
  tags: [String],
  notes: String,
  attachments: [String]
}, {
  timestamps: true
});

module.exports = mongoose.models.Expense || mongoose.model('Expense', expenseSchema); 