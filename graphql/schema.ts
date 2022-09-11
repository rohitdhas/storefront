import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  type Address {
    appartment: String
    street: String
    city: String
    state: String
    country: String
    zipCode: Number
    phone: Number
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
    key: String
    value: String
  }

  type Product {
    id: String
    title: String
    description: String
    images: [String]
    currentPrice: Number
    originalPrice: Number
    rating: Number
    stock: Number
    category: [String]
    exclusive: Boolean
    tags: [String]
    specifications: [Specification]
    color: String
  }

  type CartItem {
    productId: String
    quantity: Number
  }

  type Order {
    id: String
    products: [CartItem]
    userId: String
    paid: Boolean
    checkoutToken: String
    createdAt: Date
  }
`