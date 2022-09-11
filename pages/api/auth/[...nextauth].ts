import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from '../../../lib/mongodb';
import { Db, MongoClient } from 'mongodb';
import { compare } from 'bcryptjs';
import NextAuth from 'next-auth';

export default NextAuth({
  session: <any>{
    jwt: true,
  },
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      async authorize(credentials: any) {
        const { db }: { client: MongoClient, db: Db } = await connectToDatabase();
        const user = await db.collection('users').findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found with that email');
        }

        // When logged in with google
        if (user && !user.password) {
          throw new Error('No user found with that email');
        }

        const checkPassword = await compare(credentials.password, user.password);

        if (!checkPassword) {
          throw new Error("Incorrect Password or Email");
        }

        return { email: user.email, name: user.name };
      },
      credentials: <any>undefined
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: <any>{
    async signIn({ account, profile }: any) {
      if (account.provider === 'google') {
        const { email, name, picture } = profile;

        const { db }: { client: MongoClient, db: Db } = await connectToDatabase();
        const exists = await db
          .collection('users')
          .findOne({ email });

        if (!exists) {
          await db.collection('users').insertOne({
            email,
            name,
            picture,
          });
        }
      }
      return true;
    }
  },
  pages: {
    signIn: "/login",
  },
});