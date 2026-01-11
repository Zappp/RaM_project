import { gql } from "graphql-tag";

export const CharactersQuery = gql`
  query Characters($page: Int) {
    characters(page: $page) {
      results {
        id
        name
        status
        species
        image
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

export const CharacterQuery = gql`
  query Character($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      type
      gender
      origin {
        name
        url
      }
      location {
        name
        url
      }
      image
      episode
      created
    }
  }
`;
