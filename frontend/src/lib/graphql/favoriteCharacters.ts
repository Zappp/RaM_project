import { gql } from 'graphql-tag';

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

