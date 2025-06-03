import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("billkaro");
    const expenses = db.collection("expenses");
    const accounts = db.collection("accounts");

    switch (req.method) {
      case 'GET':
        const { category: filterCategory, startDate, endDate } = req.query;
        let query = {};

        // Apply filters if provided
        if (filterCategory) {
          query.category = filterCategory;
        }
        if (startDate || endDate) {
          query.date = {};
          if (startDate) query.date.$gte = new Date(startDate);
          if (endDate) query.date.$lte = new Date(endDate);
        }

        const expensesList = await expenses.find(query).sort({ date: -1 }).toArray();
        res.status(200).json(expensesList);
        break;

      case 'POST':
        const { amount, category, description, date, accountId } = req.body;
        
        // Validation
        if (!amount || !category || !accountId) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create expense
        const newExpense = {
          amount: parseFloat(amount),
          category,
          description: description || '',
          date: date ? new Date(date) : new Date(),
          accountId: new ObjectId(accountId),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Update account balance
        const postSession = client.startSession();
        try {
          await postSession.withTransaction(async () => {
            // Insert expense
            const result = await expenses.insertOne(newExpense, { session: postSession });
            
            // Update account balance
            await accounts.updateOne(
              { _id: new ObjectId(accountId) },
              { $inc: { balance: -parseFloat(amount) } },
              { session: postSession }
            );

            res.status(201).json({ ...newExpense, _id: result.insertedId });
          });
        } finally {
          await postSession.endSession();
        }
        break;

      case 'PUT':
        const { id, ...updateData } = req.body;
        
        if (!id) {
          return res.status(400).json({ error: 'Expense ID is required' });
        }

        // If amount is being updated, we need to adjust account balance
        if (updateData.amount !== undefined) {
          const oldExpense = await expenses.findOne({ _id: new ObjectId(id) });
          if (!oldExpense) {
            return res.status(404).json({ error: 'Expense not found' });
          }

          const amountDiff = oldExpense.amount - parseFloat(updateData.amount);
          const putSession = client.startSession();

          try {
            await putSession.withTransaction(async () => {
              // Update expense
              const updatedExpense = await expenses.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { 
                  $set: {
                    ...updateData,
                    amount: parseFloat(updateData.amount),
                    updatedAt: new Date()
                  }
                },
                { returnDocument: 'after', session: putSession }
              );

              // Update account balance
              await accounts.updateOne(
                { _id: new ObjectId(oldExpense.accountId) },
                { $inc: { balance: amountDiff } },
                { session: putSession }
              );

              if (!updatedExpense.value) {
                throw new Error('Expense not found');
              }

              res.status(200).json(updatedExpense.value);
            });
          } catch (error) {
            return res.status(404).json({ error: error.message });
          } finally {
            await putSession.endSession();
          }
        } else {
          // Simple update without amount change
          const updatedExpense = await expenses.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { 
              $set: {
                ...updateData,
                updatedAt: new Date()
              }
            },
            { returnDocument: 'after' }
          );

          if (!updatedExpense.value) {
            return res.status(404).json({ error: 'Expense not found' });
          }

          res.status(200).json(updatedExpense.value);
        }
        break;

      case 'DELETE':
        const { expenseId } = req.query;

        if (!expenseId) {
          return res.status(400).json({ error: 'Expense ID is required' });
        }

        // Find expense before deletion to get amount and accountId
        const expenseToDelete = await expenses.findOne({ _id: new ObjectId(expenseId) });
        if (!expenseToDelete) {
          return res.status(404).json({ error: 'Expense not found' });
        }

        const deleteSession = client.startSession();
        try {
          await deleteSession.withTransaction(async () => {
            // Delete expense
            const deleteResult = await expenses.deleteOne(
              { _id: new ObjectId(expenseId) },
              { session: deleteSession }
            );

            if (deleteResult.deletedCount === 0) {
              throw new Error('Expense not found');
            }

            // Restore account balance
            await accounts.updateOne(
              { _id: new ObjectId(expenseToDelete.accountId) },
              { $inc: { balance: expenseToDelete.amount } },
              { session: deleteSession }
            );

            res.status(200).json({ message: 'Expense deleted successfully' });
          });
        } catch (error) {
          return res.status(404).json({ error: error.message });
        } finally {
          await deleteSession.endSession();
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 