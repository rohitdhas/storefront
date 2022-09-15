import { getProducts, getOneProduct } from "../utils/db.utils"

export const resolvers = {
  Query: {
    products: async () => {
      return await getProducts()
    },
    product: async (_parent: any, args: any) => {
      const { id } = args;
      return await getOneProduct(id);
    }
  }
}