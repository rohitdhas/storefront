import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const CLIENT_URL = process.env.CLIENT_URL;

export const apolloClient = new ApolloClient({
  uri: `${CLIENT_URL}/api/graphql/`,
  cache: new InMemoryCache(),
});

export const productsQuery = async () => {
  const { data } = await apolloClient.query({
    query: gql`
      query GetProducts {
        products(filters: {}) {
          _id
          title
          description
          images
          currentPrice
          originalPrice
          rating
          stock
          category
          exclusive
          tags
          specifications {
            key
            value
          }
          color
        }
      }
    `,
  });
  return { data }
}