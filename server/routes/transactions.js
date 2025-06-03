const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const mongoose = require('mongoose');

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('account', 'name type')
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get transactions by account
router.get('/account/:accountId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ account: req.params.accountId })
      .populate('account', 'name type')
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single transaction
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('account', 'name type balance');
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create transaction
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { account: accountId, type, amount, ...transactionData } = req.body;

    // Find the account
    const account = await Account.findById(accountId).session(session);
    if (!account) {
      throw new Error('Account not found');
    }

    // Update account balance
    const balanceChange = type === 'CREDIT' ? amount : -amount;
    const updatedAccount = await Account.findByIdAndUpdate(
      accountId,
      { 
        $inc: { balance: balanceChange },
        lastActivityDate: new Date()
      },
      { new: true, session }
    );

    // Create transaction
    const transaction = new Transaction({
      account: accountId,
      type,
      amount,
      ...transactionData
    });
    await transaction.save({ session });

    await session.commitTransaction();
    
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('account', 'name type balance');
    
    res.status(201).json(populatedTransaction);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

// Update transaction status
router.patch('/:id/status', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status } = req.body;
    const transaction = await Transaction.findById(req.params.id).session(session);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // If transaction is being reversed, update account balance
    if (status === 'REVERSED' && transaction.status !== 'REVERSED') {
      const balanceChange = transaction.type === 'CREDIT' ? -transaction.amount : transaction.amount;
      await Account.findByIdAndUpdate(
        transaction.account,
        { 
          $inc: { balance: balanceChange },
          lastActivityDate: new Date()
        },
        { session }
      );
    }

    transaction.status = status;
    await transaction.save({ session });

    await session.commitTransaction();
    
    const updatedTransaction = await Transaction.findById(transaction._id)
      .populate('account', 'name type balance');
    
    res.json(updatedTransaction);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

// Get transaction summary
router.get('/summary/daily', async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            type: "$type"
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          transactions: {
            $push: {
              type: "$_id.type",
              total: "$total",
              count: "$count"
            }
          }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 30 }
    ]);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 