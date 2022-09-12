import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  type Address {
    appartment: String
    street: String
    city: String
    state: String
    country: String
    zipCode: Int
    phone: Int
  }

  type User {
    id: String
    email: String
    profileImg: String
    fullName: String
    type: String
    addresses: [Address]
  }

  type Specification {
    key(key: String): String
    value(key: String): String
  }

  type Product {
    id: String
    title: String
    description: String
    images: [String]
    currentPrice: Int
    originalPrice: Int
    rating: Int
    stock: Int
    category: String
    exclusive: Boolean
    tags: [String]
    specifications: [Specification]
    color: String
  }

  type CartItem {
    productId: String
    quantity: Int
  }

  type Order {
    id: String
    products: [CartItem]
    userId: String
    paid: Boolean
    checkoutToken: String
    createdAt: String
  }

  type Query {
    products: [Product]!
    user: User!
    orders: [Order]!
  }
`;

export { typeDefs };