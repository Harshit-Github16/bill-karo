import { StateCode } from '../models/GSTData';

// Validate GSTIN format
export const validateGSTIN = (gstin) => {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
};

// Validate PAN format
export const validatePAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

// Calculate GST components
export const calculateGST = (amount, rate, isInterState = false) => {
  const gstAmount = (amount * rate) / 100;
  
  if (isInterState) {
    return {
      igst: gstAmount,
      cgst: 0,
      sgst: 0,
      total: amount + gstAmount
    };
  }
  
  return {
    igst: 0,
    cgst: gstAmount / 2,
    sgst: gstAmount / 2,
    total: amount + gstAmount
  };
};

// Convert number to words (for invoice amount in words)
export const numberToWords = (number) => {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const convertLessThanThousand = (num) => {
    if (num === 0) return '';
    
    let result = '';
    
    if (num >= 100) {
      result += units[Math.floor(num / 100)] + ' Hundred ';
      num %= 100;
      if (num > 0) result += 'and ';
    }
    
    if (num >= 20) {
      result += tens[Math.floor(num / 10)] + ' ';
      num %= 10;
    } else if (num >= 11) {
      result += teens[num - 11] + ' ';
      return result;
    }
    
    if (num > 0) {
      result += units[num] + ' ';
    }
    
    return result;
  };
  
  if (number === 0) return 'Zero Rupees';
  
  const billions = Math.floor(number / 1000000000);
  const millions = Math.floor((number % 1000000000) / 1000000);
  const thousands = Math.floor((number % 1000000) / 1000);
  const remainder = number % 1000;
  
  let result = '';
  
  if (billions) result += convertLessThanThousand(billions) + 'Billion ';
  if (millions) result += convertLessThanThousand(millions) + 'Million ';
  if (thousands) result += convertLessThanThousand(thousands) + 'Thousand ';
  if (remainder) result += convertLessThanThousand(remainder);
  
  return result.trim() + ' Rupees Only';
};

// Check if e-way bill is required
export const isEWayBillRequired = (invoiceValue, distance) => {
  // As per current GST rules
  return invoiceValue > 50000 || distance > 50;
};

// Validate if businesses are in same state
export const isIntraStateTransaction = async (fromGSTIN, toGSTIN) => {
  const fromStateCode = fromGSTIN.substring(0, 2);
  const toStateCode = toGSTIN.substring(0, 2);
  return fromStateCode === toStateCode;
};

// Get financial year
export const getFinancialYear = (date = new Date()) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  if (month > 3) {
    return `${year}-${(year + 1).toString().slice(-2)}`;
  }
  return `${year - 1}-${year.toString().slice(-2)}`;
};

// Calculate tax liability
export const calculateTaxLiability = (invoices, returns) => {
  // Implementation for calculating tax liability based on invoices and returns
  const liability = {
    cgst: 0,
    sgst: 0,
    igst: 0,
    cess: 0,
    total: 0,
    paid: 0,
    pending: 0
  };
  
  // Calculate from invoices
  invoices.forEach(invoice => {
    liability.cgst += invoice.cgstTotal || 0;
    liability.sgst += invoice.sgstTotal || 0;
    liability.igst += invoice.igstTotal || 0;
    liability.cess += invoice.cessTotal || 0;
  });
  
  // Adjust based on returns
  returns.forEach(return_ => {
    liability.paid += return_.paidAmount || 0;
  });
  
  liability.total = liability.cgst + liability.sgst + liability.igst + liability.cess;
  liability.pending = liability.total - liability.paid;
  
  return liability;
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

// Round off amount as per GST rules
export const roundOff = (amount) => {
  return Math.round(amount * 100) / 100;
}; 