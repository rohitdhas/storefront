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
    zipCode: Int
    phone: Int
  }

  type User {
    _id: String
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
    _id: String
    colors: [String]
    rating: Int
    brands: [String]
    categories: [String]
    inStock: Boolean
    exclusive: Boolean
  }

  input CartItemInput {
    productId: String
    quantity: Int
  }

  input OrderInput {
    products: [CartItemInput!]
    userId: String
  }

  input AddressUpdate {
    id: ID!
    appartment: String
    street: String
    city: String
    state: String
    country: String
    zipCode: Int
    phone: Int
    updateType: UpdateType
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
    updateAddress(userId: ID!, update: AddressUpdate): ResponseMessage
  }
`;

export { typeDefs };