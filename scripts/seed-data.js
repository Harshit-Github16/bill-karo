const dbConnect = require('../lib/mongodb');
const { Account } = require('../models/Account');
const { Expense } = require('../models/Expense');

const sampleAccounts = [
  {
    name: 'Main Business Account',
    type: 'BANK',
    balance: 250000,
    description: 'Primary business bank account with HDFC',
  },
  {
    name: 'Petty Cash',
    type: 'CASH',
    balance: 15000,
    description: 'Office petty cash for small expenses',
  },
  {
    name: 'Client Receivables',
    type: 'RECEIVABLE',
    balance: 35000,
    description: 'Outstanding payments from clients',
  },
  {
    name: 'Vendor Payables',
    type: 'PAYABLE',
    balance: 25000,
    description: 'Outstanding payments to vendors',
  },
];

const sampleExpenses = [
  {
    date: new Date('2024-03-01'),
    category: 'Rent',
    description: 'Office Rent for March 2024',
    amount: 25000,
    paymentMethod: 'BANK',
    reference: 'RENT/MAR/2024',
  },
  {
    date: new Date('2024-03-05'),
    category: 'Utilities',
    description: 'Electricity Bill',
    amount: 3500,
    paymentMethod: 'BANK',
    reference: 'UTIL/MAR/2024/01',
  },
  {
    date: new Date('2024-03-10'),
    category: 'Office Supplies',
    description: 'Stationery and Printer Cartridges',
    amount: 2500,
    paymentMethod: 'CASH',
    reference: 'SUP/MAR/2024/01',
  },
  {
    date: new Date('2024-03-15'),
    category: 'Marketing',
    description: 'Social Media Marketing Campaign',
    amount: 15000,
    paymentMethod: 'BANK',
    reference: 'MKT/MAR/2024/01',
  },
  {
    date: new Date('2024-03-25'),
    category: 'Salaries',
    description: 'Staff Salaries for March 2024',
    amount: 45000,
    paymentMethod: 'BANK',
    reference: 'SAL/MAR/2024',
  },
];

async function seedData() {
  try {
    await dbConnect();

    // Clear existing data
    await Account.deleteMany({});
    await Expense.deleteMany({});

    // Insert sample accounts
    await Account.insertMany(sampleAccounts);
    console.log('✅ Sample accounts inserted successfully');

    // Insert sample expenses
    await Expense.insertMany(sampleExpenses);
    console.log('✅ Sample expenses inserted successfully');

    console.log('🌱 Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedData(); 