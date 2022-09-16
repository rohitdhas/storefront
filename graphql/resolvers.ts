import {
  getProducts, getOneProduct,
  getOrders,
  searchAutocomplete,
  createOrder,
  updateUsername,
  updateAddress
} from "../utils/db.utils"
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';

export const resolvers = {
  Query: {
    products: async (_parent: any, args: any) => {
      const { filters } = args;
      return await getProducts(filters);
    },
    product: async (_parent: any, args: any) => {
      const { id } = args;
      return await getOneProduct(id);
    },
    orders: async (_parent: any, args: any) => {
      const { userId } = args;
      return await getOrders(userId);
    },
    autocomplete: async (_parent: any, args: any) => {
      const { input } = args;
      if (!input) return await getProducts({});
      return await searchAutocomplete(input);
    }
  },
  Mutation: {
    createOrder: async (_parent: any, args: any, context: any) => {
      const { order } = args;
      order.user = context.user._id;
      return await createOrder(order);
    },
    updateUsername: async (_parent: any, args: any, context: any) => {
      const { update } = args;
      return await updateUsername(context.user._id, update);
    },
    updateAddress: async (_parent: any, args: any, context: any) => {
      const { update } = args;
      return await updateAddress(context.user._id, update);
    }
  },
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
}