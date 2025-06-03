const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['DEBTOR', 'CREDITOR', 'BANK', 'CASH', 'ASSET', 'LIABILITY'],
    required: true
  },
  category: {
    type: String,
    enum: ['CUSTOMER', 'SUPPLIER', 'EMPLOYEE', 'BANK', 'CASH', 'OTHER'],
    required: true
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  creditLimit: {
    type: Number
  },
  openingBalance: {
    type: Number,
    required: true
  },
  openingDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'BLOCKED', 'SUSPENDED', 'CLOSED'],
    default: 'ACTIVE'
  },
  currency: {
    type: String,
    default: 'INR'
  },
  contactPerson: String,
  phone: String,
  email: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  gstNumber: String,
  panNumber: String,
  businessType: String,
  paymentTerms: Number,
  creditDays: Number,
  interestRate: Number,
  notes: String,
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  lastActivityDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Account', accountSchema); 