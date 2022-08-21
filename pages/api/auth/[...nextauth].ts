import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from '../../../lib/mongodb';
import { compare } from 'bcryptjs';
import NextAuth from 'next-auth';

export default NextAuth({
  session: <any>{
    jwt: true,
  },
  providers: [
    Credentials({
      async authorize(credentials: any) {
        const { db }: any = await connectToDatabase();
        const users = await db().collection('users');

        const result = await users.findOne({
          email: credentials.email,
        });

        if (!result) {
          throw new Error('No user found with the email');
        }

        const checkPassword = await compare(credentials.passowrd, result.passowrd);

        if (!checkPassword) {
          throw new Error("Password doesn't match");
        }

        return { email: result.email, name: result.name };
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

        const { db }: any = await connectToDatabase();
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

        return true
      }
    }
  },
  pages: {
    signIn: "/login",
  },
});