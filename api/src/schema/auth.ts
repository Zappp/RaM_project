export const authTypeDefs = `
  type User {
    id: ID!
    email: String!
    createdAt: String!
    emailVerified: Boolean!
  }

  type AuthPayload {
    user: User!
    token: String
    requiresEmailVerification: Boolean!
  }

  type Query {
    me: User
  }

  type Mutation {
    signup(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    logout: Boolean!
    resendVerificationEmail(email: String!): Boolean!
    verifyEmail(token: String!): AuthPayload!
  }
`;
