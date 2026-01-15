export const charactersTypeDefs = `
  type Character {
    id: ID!
    name: String!
    status: String
    species: String
    type: String
    gender: String
    origin: Location
    location: Location
    image: String
    episode: [String!]!
    created: String
  }

  type Location {
    name: String
    url: String
  }

  type PageInfo {
    count: Int!
    pages: Int!
    next: Int
    prev: Int
  }

  type CharactersResponse {
    results: [Character!]!
    info: PageInfo!
  }

  type Query {
    characters(page: Int): CharactersResponse!
  }
`;
