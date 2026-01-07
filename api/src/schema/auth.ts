export const authTypeDefs = `
  type User {
    id: ID!
    email: String
    emailVerified: Boolean!
  }

  type AuthPayload {
    user: User!
    token: String
  }

  type Query {
    me: User
  }

  type Mutation {
    signup(email: String!, password: String!): User!
    login(email: String!, password: String!): AuthPayload!
    logout: Boolean!
  }
`;
