import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const client = await clientPromise;
    const db = client.db("billkaro");
    const expenses = db.collection("expenses");
    const accounts = db.collection("accounts");

    // Get query parameters
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    // Get total expenses
    const totalExpenses = await expenses.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]).toArray();

    // Get expenses by category
    const expensesByCategory = await expenses.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]).toArray();

    // Get monthly expenses
    const monthlyExpenses = await expenses.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]).toArray();

    // Get account balances
    const accountBalances = await accounts.find({}).toArray();

    // Get recent transactions
    const recentTransactions = await expenses.find({})
      .sort({ date: -1 })
      .limit(5)
      .toArray();

    // Format the response
    const report = {
      summary: {
        totalExpenses: totalExpenses[0]?.total || 0,
        totalAccounts: accountBalances.length,
        totalBalance: accountBalances.reduce((sum, acc) => sum + acc.balance, 0)
      },
      expensesByCategory: expensesByCategory.map(cat => ({
        category: cat._id,
        amount: cat.total,
        percentage: (cat.total / (totalExpenses[0]?.total || 1)) * 100
      })),
      monthlyTrend: monthlyExpenses.map(month => ({
        year: month._id.year,
        month: month._id.month,
        amount: month.total
      })),
      accountBalances: accountBalances.map(acc => ({
        id: acc._id,
        name: acc.name,
        balance: acc.balance,
        type: acc.type
      })),
      recentTransactions: recentTransactions.map(tx => ({
        id: tx._id,
        amount: tx.amount,
        category: tx.category,
        description: tx.description,
        date: tx.date
      }))
    };

    res.status(200).json(report);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 