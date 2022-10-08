import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useState, useEffect } from "react";

const CLIENT_URL = process.env.CLIENT_URL;

export const apolloClient = new ApolloClient({
  uri: `${CLIENT_URL}/api/graphql/`,
  cache: new InMemoryCache()
});

export const useFetch = (fetcher: any, params: any, initialFetch: boolean = true) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (initialFetch) {
      fetchData(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchData(params: any) {
    setIsLoading(true);
    const res = await fetcher(params);
    const { data } = await res;
    setData(data);
    setIsLoading(false);
    return data;
  }

  return { isLoading, data, fetchData };
}

export const productsQuery = async (filters: any = {}) => {
  const { data } = await apolloClient.query({
    query: gql`
      query GetProducts($filters: Filters) {
        products(filters: $filters) {
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
    `, variables: { filters }
  });
  return { data }
}

export const autocompleteQuery = async (input: string) => {
  if (!input) return { autocomplete: [] };
  const { data } = await apolloClient.query({
    query: gql`
      query GetProducts($input: String!) {
        autocomplete(input: $input) {
          _id
          title
        }
      }
    `, variables: { input }
  });
  return { data }
}

export const updateAddressQuery = async (inputData: { updateType: string, address: any }) => {
  const { updateType, address } = inputData;
  const { data } = await apolloClient.mutate({
    mutation: gql`
       mutation Mutation($update: AddressUpdate) {
        updateAddress(update: $update) {
          data
          isError
          message
        }
      }
    `, variables: { update: { updateType, address } }
  });
  return { data }
}

export const createCheckoutQuery = async (input: any) => {
  const { cartItems, addressId } = input;

  const { data } = await apolloClient.mutate({
    mutation: gql`
       mutation Mutation($order: OrderInput!) {
        createOrder(order: $order) {
          data
          isError
          message
        }
      }
    `, variables: { order: { products: cartItems, addressId } }
  });
  return { data }
}