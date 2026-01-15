export const authGraphQLSchema = `
  type User {
    id: ID!
    email: String
  }

  type LoginResponse {
    user: User!
  }

  type SignupResponse {
    user: User
    message: String
  }

  type Mutation {
    login(email: String!, password: String!): LoginResponse!
    signup(email: String!, password: String!): SignupResponse!
    logout: Boolean!
  }
`;
