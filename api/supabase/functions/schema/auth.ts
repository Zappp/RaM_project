export const authTypeDefs = `
  type User {
    id: ID!
    email: String!
    createdAt: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    signup(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    logout: Boolean!
  }
`;

export const authResolvers = {
  Query: {
    me: () => {
      throw new Error("Not implemented yet");
    },
  },
  Mutation: {
    signup: () => {
      throw new Error("Not implemented yet");
    },
    login: () => {
      throw new Error("Not implemented yet");
    },
    logout: () => {
      throw new Error("Not implemented yet");
    },
  },
};
