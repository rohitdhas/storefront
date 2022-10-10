import {
  getProducts,
  getOneProduct,
  getOrders,
  searchAutocomplete,
  createOrderCall,
  updateUsernameCall,
  updateAddressCall,
} from "../utils/db.utils";
import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";

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
    orders: async (_parent: any, args: any, ctx: any) => {
      return await getOrders(ctx.email);
    },
    autocomplete: async (_parent: any, args: any) => {
      const { input } = args;
      if (!input) return await getProducts({});
      return await searchAutocomplete(input);
    },
  },
  Mutation: {
    createOrder: async (_parent: any, args: any, context: any) => {
      const { order } = args;
      order.user = context.email;
      return await createOrderCall(order);
    },
    updateUsername: async (_parent: any, args: any, context: any) => {
      const { update } = args;
      return await updateUsernameCall(context.email, update);
    },
    updateAddress: async (_parent: any, args: any, context: any) => {
      const { update } = args;
      return await updateAddressCall(context.email, update);
    },
  },
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
};
