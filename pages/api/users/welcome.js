import { getSession } from 'next-auth/react';
import { User } from '../../../server/models/User';
import dbConnect from '../../../server/config/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  await dbConnect();

  try {
    await User.findOneAndUpdate(
      { email: session.user.email },
      { isFirstLogin: false }
    );
    res.status(200).json({ message: 'Welcome status updated' });
  } catch (error) {
    console.error('Error updating welcome status:', error);
    res.status(500).json({ error: 'Failed to update welcome status' });
  }
} 