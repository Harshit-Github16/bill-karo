const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  category: {
    type: String,
    required: true,
    enum: ['Office Supplies', 'Utilities', 'Rent', 'Salaries', 'Marketing', 'Other'],
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'BANK', 'CREDIT'],
    required: true,
  },
  reference: {
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

const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

module.exports = { Expense }; 