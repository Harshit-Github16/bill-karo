import { Order } from '../../../server/models/Order';
import dbConnect from '../../../server/config/db';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const orders = await Order.find()
        .populate('items')
        .sort({ date: -1 });
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  } else if (req.method === 'POST') {
    try {
      const order = await Order.create({
        ...req.body,
        date: new Date(req.body.date),
        deliveryDate: req.body.deliveryDate ? new Date(req.body.deliveryDate) : null
      });
      res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 