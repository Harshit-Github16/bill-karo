import { getSession } from 'next-auth/react';
import { Invoice } from '../../../models/Invoice';
import { Business } from '../../../models/Business';
import { HSNCode } from '../../../models/GSTData';
import dbConnect from '../../../lib/mongodb';
import { 
  validateGSTIN, 
  calculateGST, 
  numberToWords, 
  isIntraStateTransaction,
  roundOff
} from '../../../utils/gstUtils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    await dbConnect();

    // Get business details
    const business = await Business.findOne({ userId: session.user.id });
    if (!business) {
      return res.status(404).json({ error: 'Business profile not found' });
    }

    const {
      customerName,
      customerGstin,
      customerAddress,
      items,
      dueDate,
      notes,
      termsAndConditions
    } = req.body;

    // Validate customer GSTIN
    if (customerGstin && !validateGSTIN(customerGstin)) {
      return res.status(400).json({ error: 'Invalid customer GSTIN' });
    }

    // Check if intra-state or inter-state
    const isInterState = await isIntraStateTransaction(business.gstin, customerGstin);

    // Process items and calculate totals
    let subTotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    let igstTotal = 0;
    let totalAmount = 0;

    // Validate and process each item
    const processedItems = await Promise.all(items.map(async (item) => {
      // Get HSN code details
      const hsnDetails = await HSNCode.findOne({ code: item.hsnCode });
      if (!hsnDetails) {
        throw new Error(`Invalid HSN code: ${item.hsnCode}`);
      }

      // Calculate item level values
      const taxableValue = roundOff(item.quantity * item.price - (item.discount || 0));
      const gst = calculateGST(taxableValue, hsnDetails.gstRate, isInterState);

      // Accumulate totals
      subTotal += taxableValue;
      cgstTotal += gst.cgst;
      sgstTotal += gst.sgst;
      igstTotal += gst.igst;
      totalAmount += gst.total;

      return {
        ...item,
        taxableValue,
        cgstRate: hsnDetails.cgstRate,
        cgstAmount: gst.cgst,
        sgstRate: hsnDetails.sgstRate,
        sgstAmount: gst.sgst,
        igstRate: hsnDetails.igstRate,
        igstAmount: gst.igst,
        totalAmount: gst.total
      };
    }));

    // Round off values
    subTotal = roundOff(subTotal);
    cgstTotal = roundOff(cgstTotal);
    sgstTotal = roundOff(sgstTotal);
    igstTotal = roundOff(igstTotal);
    totalAmount = roundOff(totalAmount);

    // Calculate round off amount
    const roundOffAmount = Math.round(totalAmount) - totalAmount;
    totalAmount = Math.round(totalAmount);

    // Create invoice
    const invoice = new Invoice({
      userId: session.user.id,
      invoiceDate: new Date(),
      dueDate: new Date(dueDate),
      
      // Business Details
      businessName: business.name,
      gstin: business.gstin,
      address: business.registeredAddress,
      bankDetails: business.bankAccounts.find(acc => acc.isPrimary),

      // Customer Details
      customerName,
      customerGstin,
      customerAddress,
      placeOfSupply: customerAddress.state,

      // Items and Calculations
      items: processedItems,
      subTotal,
      cgstTotal,
      sgstTotal,
      igstTotal,
      totalAmount,
      roundOff: roundOffAmount,
      amountInWords: numberToWords(totalAmount),

      // Additional Details
      notes,
      termsAndConditions: termsAndConditions || business.invoiceSettings.termsAndConditions,
      status: 'ACTIVE',
      category: 'SALE'
    });

    await invoice.save();

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice: {
        id: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        totalAmount: invoice.totalAmount
      }
    });

  } catch (error) {
    console.error('Invoice creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create invoice',
      details: error.message 
    });
  }
} 