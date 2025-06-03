import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("billkaro");
    const accounts = db.collection("accounts");

    switch (req.method) {
      case 'GET':
        const accountsList = await accounts.find({}).toArray();
        res.status(200).json(accountsList);
        break;

      case 'POST':
        const { name, type, balance, description } = req.body;
        
        // Validation
        if (!name || !type || balance === undefined) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create account
        const newAccount = {
          name,
          type,
          balance: parseFloat(balance),
          description: description || '',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await accounts.insertOne(newAccount);
        res.status(201).json({ ...newAccount, _id: result.insertedId });
        break;

      case 'PUT':
        const { id, ...updateData } = req.body;
        
        if (!id) {
          return res.status(400).json({ error: 'Account ID is required' });
        }

        const updatedAccount = await accounts.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { 
            $set: {
              ...updateData,
              updatedAt: new Date()
            }
          },
          { returnDocument: 'after' }
        );

        if (!updatedAccount.value) {
          return res.status(404).json({ error: 'Account not found' });
        }

        res.status(200).json(updatedAccount.value);
        break;

      case 'DELETE':
        const { accountId } = req.query;

        if (!accountId) {
          return res.status(400).json({ error: 'Account ID is required' });
        }

        const deleteResult = await accounts.deleteOne({ _id: new ObjectId(accountId) });

        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ error: 'Account not found' });
        }

        res.status(200).json({ message: 'Account deleted successfully' });
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