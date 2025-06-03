import { Reminder } from '../../../server/models/Reminder';
import dbConnect from '../../../server/config/db';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const reminders = await Reminder.find().sort({ dueDate: 1 });
      res.status(200).json(reminders);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      res.status(500).json({ error: 'Failed to fetch reminders' });
    }
  } else if (req.method === 'POST') {
    try {
      const reminder = await Reminder.create(req.body);
      res.status(201).json(reminder);
    } catch (error) {
      console.error('Error creating reminder:', error);
      res.status(500).json({ error: 'Failed to create reminder' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 