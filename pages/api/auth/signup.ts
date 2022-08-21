import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/mongodb';
import { hash } from 'bcryptjs';

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method === 'POST') {
    const { email, password, fullName } = req.body;

    if (!email || !email.includes('@') || !password || !fullName) {
      res.status(422).json({ isError: true, message: 'Invalid Data' });
      return;
    }

    const { db }: any = await connectToDatabase();
    const checkExisting = await db
      .collection('users')
      .findOne({ email: email });

    if (checkExisting) {
      res.status(422).json({ isError: true, message: 'Email already used!' });
      return;
    }

    const status = await db.collection('users').insertOne({
      email,
      name: fullName,
      password: await hash(password, 12),
    });

    res.status(201).json({ isError: false, message: 'User created successfully!', ...status });
  } else {
    res.status(500).json({ isError: true, message: 'Invalid Route' });
  }
}

export default handler;