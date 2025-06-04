import mongoose from 'mongoose';

const hsnCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  gstRate: { type: Number, required: true },
  cgstRate: { type: Number, required: true },
  sgstRate: { type: Number, required: true },
  igstRate: { type: Number, required: true },
  cessRate: { type: Number, default: 0 },
  category: String,
  subCategory: String,
  unit: String,
  validFrom: Date,
  validUpto: Date,
  isActive: { type: Boolean, default: true }
});

const stateCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gstStateCode: { type: String, required: true },
  zoneType: { type: String, enum: ['NORMAL', 'SPECIAL'] },
  isUnionTerritory: { type: Boolean, default: false }
});

// For storing tax rates and their history
const taxRateSchema = new mongoose.Schema({
  category: { type: String, required: true },
  rate: { type: Number, required: true },
  applicableFrom: { type: Date, required: true },
  applicableUpto: Date,
  isActive: { type: Boolean, default: true },
  rateType: {
    type: String,
    enum: ['NORMAL', 'SPECIAL', 'COMPOSITE'],
    default: 'NORMAL'
  }
});

// For storing GST exemptions and special cases
const gstExemptionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  description: { type: String, required: true },
  conditions: [String],
  applicableFrom: { type: Date, required: true },
  applicableUpto: Date,
  notificationNumber: String,
  isActive: { type: Boolean, default: true }
});

// Indexes
hsnCodeSchema.index({ code: 1 });
hsnCodeSchema.index({ category: 1, subCategory: 1 });
stateCodeSchema.index({ gstStateCode: 1 });
taxRateSchema.index({ category: 1, applicableFrom: -1 });
gstExemptionSchema.index({ category: 1, applicableFrom: -1 });

// Models
export const HSNCode = mongoose.models.HSNCode || mongoose.model('HSNCode', hsnCodeSchema);
export const StateCode = mongoose.models.StateCode || mongoose.model('StateCode', stateCodeSchema);
export const TaxRate = mongoose.models.TaxRate || mongoose.model('TaxRate', taxRateSchema);
export const GSTExemption = mongoose.models.GSTExemption || mongoose.model('GSTExemption', gstExemptionSchema); 