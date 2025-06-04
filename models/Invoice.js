import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' }
});

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hsnCode: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  taxableValue: { type: Number, required: true },
  cgstRate: { type: Number, required: true },
  cgstAmount: { type: Number, required: true },
  sgstRate: { type: Number, required: true },
  sgstAmount: { type: Number, required: true },
  igstRate: { type: Number, required: true },
  igstAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true }
});

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  invoiceDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  
  // Business Details (Seller)
  businessName: { type: String, required: true },
  gstin: { type: String, required: true },
  address: { type: addressSchema, required: true },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    branch: String
  },

  // Customer Details
  customerName: { type: String, required: true },
  customerGstin: { type: String },
  customerAddress: { type: addressSchema, required: true },
  placeOfSupply: { type: String, required: true },
  
  // Invoice Items
  items: [itemSchema],
  
  // Totals
  subTotal: { type: Number, required: true },
  cgstTotal: { type: Number, required: true },
  sgstTotal: { type: Number, required: true },
  igstTotal: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  roundOff: { type: Number, default: 0 },
  amountInWords: { type: String, required: true },
  
  // Payment Details
  paymentStatus: {
    type: String,
    enum: ['PAID', 'UNPAID', 'PARTIAL', 'OVERDUE'],
    default: 'UNPAID'
  },
  paymentDue: { type: Number, default: 0 },
  paymentHistory: [{
    amount: Number,
    date: Date,
    mode: String,
    reference: String
  }],

  // E-way Bill Details
  eWayBill: {
    number: String,
    date: Date,
    validUpto: Date
  },

  // Additional Fields
  notes: String,
  termsAndConditions: [String],
  status: {
    type: String,
    enum: ['DRAFT', 'ACTIVE', 'CANCELLED'],
    default: 'DRAFT'
  },
  category: {
    type: String,
    enum: ['SALE', 'PURCHASE', 'EXPORT', 'IMPORT'],
    required: true
  },
  attachments: [{
    name: String,
    url: String,
    type: String
  }]
}, {
  timestamps: true
});

// Indexes for faster queries
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ invoiceDate: -1 });
invoiceSchema.index({ userId: 1, invoiceDate: -1 });
invoiceSchema.index({ gstin: 1 });
invoiceSchema.index({ customerGstin: 1 });
invoiceSchema.index({ 'items.hsnCode': 1 });

// Auto-generate invoice number
invoiceSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Find the last invoice number for this financial year
    const lastInvoice = await this.constructor.findOne({
      invoiceNumber: new RegExp(`^INV/${year}${month}/`)
    }).sort({ invoiceNumber: -1 });
    
    let sequence = '0001';
    if (lastInvoice) {
      const lastSequence = parseInt(lastInvoice.invoiceNumber.split('/').pop());
      sequence = (lastSequence + 1).toString().padStart(4, '0');
    }
    
    this.invoiceNumber = `INV/${year}${month}/${sequence}`;
  }
  next();
});

export const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema); 