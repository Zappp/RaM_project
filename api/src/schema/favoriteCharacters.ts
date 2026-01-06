export const favoriteCharactersTypeDefs = `
  type FavoriteCharacter {
    id: ID!
    userId: ID!
    characterId: Int!
    characterName: String!
    characterImage: String
    createdAt: String!
    updatedAt: String!
  }

  type PageInfo {
    count: Int!
    pages: Int!
    next: Int
    prev: Int
  }

  type FavoritesResponse {
    results: [FavoriteCharacter!]!
    info: PageInfo!
  }

  extend type Query {
    favorites(page: Int, pageSize: Int): FavoritesResponse!
    favorite(characterId: Int!): FavoriteCharacter
  }

  extend type Mutation {
    addFavorite(characterId: Int!, characterName: String!, characterImage: String): FavoriteCharacter!
    removeFavorite(characterId: Int!): Boolean!
  }
`;

