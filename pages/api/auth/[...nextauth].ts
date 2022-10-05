import { connectToDatabase, ConnectionType } from '../../../lib/mongodb';
import GoogleProvider from "next-auth/providers/google";
import NextAuth from 'next-auth';

export default NextAuth({
  session: <any>{
    jwt: true,
  },
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // authorization: {
      //   params: {
      //     prompt: "consent",
      //     access_type: "offline",
      //     response_type: "code"
      //   }
      // }
    })
  ],
  pages: {
    signIn: "/",
    error: '/',
  },
  callbacks: <any>{
    async signIn({ account, profile }: any) {
      if (account.provider === 'google') {
        const { email, name, picture } = profile;

        const { db }: ConnectionType = await connectToDatabase();
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
    },
    async session({ session }: { session: { user: any, expires: string } }) {
      const user = session.user;
      const { db }: ConnectionType = await connectToDatabase();
      const userData: any = await db
        .collection('users')
        .findOne({ email: user.email });

      const res = { ...session };
      res.user.address = userData.addresses;
      return res;
    }
  }
});