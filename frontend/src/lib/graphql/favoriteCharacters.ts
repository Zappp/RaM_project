import { gql } from 'graphql-tag';

export const FavoriteCharactersQuery = gql`
  query FavoriteCharacters($page: Int, $pageSize: Int) {
    favoriteCharacters(page: $page, pageSize: $pageSize) {
      results {
        id
        userId
        characterId
        characterName
        characterImage
        characterStatus
        characterSpecies
        createdAt
        updatedAt
      }
      info {
        count
        pages
        next
        prev
      }
    }
  }
`;

export const FavoriteCharacterQuery = gql`
  query FavoriteCharacter($characterId: Int!) {
    favoriteCharacter(characterId: $characterId) {
      id
      userId
      characterId
      characterName
      characterImage
      characterStatus
      characterSpecies
      createdAt
      updatedAt
    }
  }
`;

export const AddFavoriteCharacterMutation = gql`
  mutation AddFavoriteCharacter($characterId: Int!, $characterName: String!, $characterImage: String) {
    addFavoriteCharacter(characterId: $characterId, characterName: $characterName, characterImage: $characterImage) {
      id
      characterId
      characterName
      characterImage
      createdAt
      updatedAt
    }
  }
`;

export const RemoveFavoriteCharacterMutation = gql`
  mutation RemoveFavoriteCharacter($characterId: Int!) {
    removeFavoriteCharacter(characterId: $characterId)
  }
`;

