import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '../../graphql/schema';
import { resolvers } from '../../graphql/resolvers';
import { getSession } from 'next-auth/react';
import Cors from 'micro-cors';

const apolloServer = new ApolloServer({
  typeDefs, resolvers,
  context: async ({ req }) => {
    const session = await getSession({ req });
    return { session };
  }
});

const startServer = apolloServer.start();

const cors = Cors();

export default cors(async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  await startServer;

  await apolloServer.createHandler({
    path: "/api/graphql"
  })(req, res)

})

export const config = {
  api: {
    bodyParser: false
  }
}