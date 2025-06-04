import { StateCode } from '../../models/GSTData';
import dbConnect from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const states = await StateCode.find()
      .select('code name gstStateCode')
      .sort('name');
    
    res.status(200).json(states);
  } catch (error) {
    console.error('States fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch states' });
  }
} 