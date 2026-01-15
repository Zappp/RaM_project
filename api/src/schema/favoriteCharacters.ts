export const favoriteCharactersTypeDefs = `
  type FavoriteCharacter {
    id: ID!
    userId: ID!
    characterId: Int!
    characterName: String!
    characterImage: String
    characterStatus: String
    characterSpecies: String
    createdAt: String!
    updatedAt: String!
  }

  type PageInfo {
    count: Int!
    pages: Int!
    next: Int
    prev: Int
  }

  type FavoriteCharactersResponse {
    results: [FavoriteCharacter!]!
    info: PageInfo!
  }

  extend type Query {
    favoriteCharacters(page: Int, pageSize: Int): FavoriteCharactersResponse!
    favoriteCharactersByIds(characterIds: [Int!]!): [FavoriteCharacter!]!
  }

  type Mutation {
    addFavoriteCharacter(characterId: Int!, characterName: String!, characterImage: String): FavoriteCharacter!
    removeFavoriteCharacter(characterId: Int!): Boolean!
  }
`;
