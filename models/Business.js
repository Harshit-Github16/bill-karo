import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Basic Details
  name: { type: String, required: true },
  tradeName: String,
  gstin: { type: String, required: true, unique: true },
  pan: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  website: String,
  
  // Address
  registeredAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  
  // Additional Addresses (like warehouse, branch office)
  additionalAddresses: [{
    type: { type: String, required: true },
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  }],
  
  // Bank Details
  bankAccounts: [{
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bankName: { type: String, required: true },
    branch: String,
    isPrimary: { type: Boolean, default: false }
  }],
  
  // Business Type
  businessType: {
    type: String,
    enum: ['PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'HUF', 'OTHER'],
    required: true
  },
  
  // GST Details
  gstDetails: {
    registrationType: {
      type: String,
      enum: ['REGULAR', 'COMPOSITION', 'CASUAL', 'SEZ', 'ISD', 'TDS', 'TCS'],
      required: true
    },
    registrationDate: { type: Date, required: true },
    lastFiledReturn: Date,
    compositionScheme: {
      isEnrolled: { type: Boolean, default: false },
      enrollmentDate: Date,
      category: String
    }
  },
  
  // Financial Year Settings
  financialYear: {
    startMonth: { type: Number, default: 4 }, // April
    endMonth: { type: Number, default: 3 }, // March
    currentFY: String
  },
  
  // Invoice Settings
  invoiceSettings: {
    prefix: { type: String, default: 'INV' },
    startingNumber: { type: Number, default: 1 },
    currentNumber: { type: Number, default: 1 },
    format: { type: String, default: '{{PREFIX}}/{{YYYY}}-{{YY}}/{{MM}}/{{NUMBER}}' },
    termsAndConditions: [String],
    notes: String,
    logo: String,
    signature: String
  },
  
  // Compliance Settings
  complianceSettings: {
    tdsApplicable: { type: Boolean, default: false },
    tdsPercentage: Number,
    tcsApplicable: { type: Boolean, default: false },
    tcsPercentage: Number,
    eInvoicingEnabled: { type: Boolean, default: false },
    eWayBillEnabled: { type: Boolean, default: false }
  },
  
  // Notification Settings
  notificationSettings: {
    gstFilingReminder: { type: Boolean, default: true },
    paymentReminder: { type: Boolean, default: true },
    returnFilingReminder: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Indexes
businessSchema.index({ userId: 1 });
businessSchema.index({ gstin: 1 });
businessSchema.index({ pan: 1 });
businessSchema.index({ 'registeredAddress.state': 1 });

export const Business = mongoose.models.Business || mongoose.model('Business', businessSchema); 