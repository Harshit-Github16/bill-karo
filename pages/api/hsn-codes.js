import { HSNCode } from '../../models/GSTData';
import dbConnect from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const { search, category } = req.query;
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { code: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    const hsnCodes = await HSNCode.find(query)
      .select('code description gstRate category')
      .sort('code')
      .limit(100);
    
    res.status(200).json(hsnCodes);
  } catch (error) {
    console.error('HSN codes fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch HSN codes' });
  }
} 