import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase, ConnectionType } from '../../../lib/mongodb';
import { hash } from 'bcryptjs';

interface Response {
  isError: boolean;
  message: string;
  [key: string]: any;
}

async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  if (req.method === 'POST') {
    const { email, password, fullName } = req.body;

    if (!email || !email.includes('@') || !password || !fullName) {
      res.status(422).json({ isError: true, message: 'Invalid Data' });
      return;
    }

    const { db }: ConnectionType = await connectToDatabase();
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