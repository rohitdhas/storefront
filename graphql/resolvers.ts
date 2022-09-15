import { getProducts, getOneProduct, getOrders, searchAutocomplete } from "../utils/db.utils"

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
  }
}