import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  scalar JSON
  scalar JSONObject

  type Address {
    id: ID!
    appartment: String
    street: String
    city: String
    state: String
    country: String
    zipCode: String
    phone: String

  }

  type User {
    _id: String
    email: String
    picture: String
    fullName: String
    type: String
    addresses: [Address]
  }

  type Specification {
    key: String
    value: String
  }

  type Product {
    _id: String
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

  type ResponseMessage {
    message: String
    isError: Boolean
    data: JSON
  }

  enum UpdateType {
    ADD
    UPDATE
    DELETE
  }

  input Filters {
    id: String
    colors: [String]
    rating: String
    brands: [String]
    categories: [String]
    inStock: String
    priceRange: [String]
    exclusive: String
  }

  input CartItemInput {
    productId: String
    quantity: Int
  }

  input OrderInput {
    products: [CartItemInput!]
    userId: String
  }

  input AddressInput {
    id: ID!
    apartment: String
    street: String
    city: String
    state: String
    country: String
    zipCode: String
    phone: String
  }

  input AddressUpdate {
    updateType: String
    address: AddressInput
  }

  type Query {
    products(filters: Filters): [Product]
    product(id: ID!): Product
    user(id: ID!): User!
    orders(userId: ID!): [Order]
    autocomplete(input: String!): [Product]
  }

  type Mutation {
    createOrder(userId: ID!, order: OrderInput!): ResponseMessage
    updateUsername(userId: ID!, update: String!): ResponseMessage
    updateAddress(update: AddressUpdate): ResponseMessage
  }
`;

export { typeDefs };