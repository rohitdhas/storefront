import { getProducts } from "../utils/db.utils"

export const resolvers = {
  Query: {
    products: async () => await getProducts(),
    user: () => {
      return { id: 1, fullName: "rohit", email: "rohit@mail.com", type: "admin" }
    }
  }
}