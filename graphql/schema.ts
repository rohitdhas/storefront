import { gql } from "apollo-server-micro";

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
    id: String
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
    brand: String
    color: String
    tagline: String
  }

  type CartItem {
    productId: String
    quantity: Int
    title: String
  }

  type Order {
    _id: String
    products: [CartItem]
    user: String
    paid: Boolean
    totalAmount: Int
    status: String
    order_id: String
    checkoutToken: String
    address: String
    deliveryDate: String
    paymentReceipt: String
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
    productIds: [String]
  }

  input SpecificationInput {
    id: String
    key: String
    value: String
  }

  input ProductInput {
    _id: String!
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
    specifications: [SpecificationInput]
    brand: String
    color: String
    tagline: String
  }

  input AddProductInput {
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
    specifications: [SpecificationInput]
    brand: String
    color: String
    tagline: String
  }

  input CartItemInput {
    productId: String
    quantity: Int
  }

  input OrderInput {
    products: [CartItemInput!]
    addressId: String!
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
    orders: [Order]
    autocomplete(input: String!): [Product]
  }

  type Mutation {
    createOrder(order: OrderInput!): ResponseMessage
    createProduct(productData: AddProductInput!): ResponseMessage
    updateUsername(update: String!): ResponseMessage
    updateAddress(update: AddressUpdate): ResponseMessage
    updateProduct(update: ProductInput!): ResponseMessage
    deleteProduct(productId: String!): ResponseMessage
  }
`;

export { typeDefs };
