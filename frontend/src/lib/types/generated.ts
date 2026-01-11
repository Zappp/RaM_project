import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type Character = {
  __typename?: "Character";
  created?: Maybe<Scalars["String"]["output"]>;
  episode: Array<Scalars["String"]["output"]>;
  gender?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  location?: Maybe<Location>;
  name: Scalars["String"]["output"];
  origin?: Maybe<Location>;
  species?: Maybe<Scalars["String"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
};

export type CharactersResponse = {
  __typename?: "CharactersResponse";
  info: PageInfo;
  results: Array<Character>;
};

export type FavoriteCharacter = {
  __typename?: "FavoriteCharacter";
  characterId: Scalars["Int"]["output"];
  characterImage?: Maybe<Scalars["String"]["output"]>;
  characterName: Scalars["String"]["output"];
  characterSpecies?: Maybe<Scalars["String"]["output"]>;
  characterStatus?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  updatedAt: Scalars["String"]["output"];
  userId: Scalars["ID"]["output"];
};

export type FavoriteCharactersResponse = {
  __typename?: "FavoriteCharactersResponse";
  info: PageInfo;
  results: Array<FavoriteCharacter>;
};

export type Location = {
  __typename?: "Location";
  name?: Maybe<Scalars["String"]["output"]>;
  url?: Maybe<Scalars["String"]["output"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  addFavoriteCharacter: FavoriteCharacter;
  removeFavoriteCharacter: Scalars["Boolean"]["output"];
};

export type MutationAddFavoriteCharacterArgs = {
  characterId: Scalars["Int"]["input"];
  characterImage?: InputMaybe<Scalars["String"]["input"]>;
  characterName: Scalars["String"]["input"];
};

export type MutationRemoveFavoriteCharacterArgs = {
  characterId: Scalars["Int"]["input"];
};

export type PageInfo = {
  __typename?: "PageInfo";
  count: Scalars["Int"]["output"];
  next?: Maybe<Scalars["Int"]["output"]>;
  pages: Scalars["Int"]["output"];
  prev?: Maybe<Scalars["Int"]["output"]>;
};

export type Query = {
  __typename?: "Query";
  character?: Maybe<Character>;
  characters: CharactersResponse;
  favoriteCharacter?: Maybe<FavoriteCharacter>;
  favoriteCharacters: FavoriteCharactersResponse;
  favoriteCharactersByIds: Array<FavoriteCharacter>;
};

export type QueryCharacterArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryCharactersArgs = {
  page?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryFavoriteCharacterArgs = {
  characterId: Scalars["Int"]["input"];
};

export type QueryFavoriteCharactersArgs = {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryFavoriteCharactersByIdsArgs = {
  characterIds: Array<Scalars["Int"]["input"]>;
};

export type CharactersQueryVariables = Exact<{
  page?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type CharactersQuery = {
  __typename?: "Query";
  characters: {
    __typename?: "CharactersResponse";
    results: Array<{
      __typename?: "Character";
      id: string;
      name: string;
      status?: string | null;
      species?: string | null;
      image?: string | null;
    }>;
    info: {
      __typename?: "PageInfo";
      count: number;
      pages: number;
      next?: number | null;
      prev?: number | null;
    };
  };
};

export type CharacterQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type CharacterQuery = {
  __typename?: "Query";
  character?: {
    __typename?: "Character";
    id: string;
    name: string;
    status?: string | null;
    species?: string | null;
    type?: string | null;
    gender?: string | null;
    image?: string | null;
    episode: Array<string>;
    created?: string | null;
    origin?: { __typename?: "Location"; name?: string | null; url?: string | null } | null;
    location?: { __typename?: "Location"; name?: string | null; url?: string | null } | null;
  } | null;
};

export type FavoriteCharactersQueryVariables = Exact<{
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type FavoriteCharactersQuery = {
  __typename?: "Query";
  favoriteCharacters: {
    __typename?: "FavoriteCharactersResponse";
    results: Array<{
      __typename?: "FavoriteCharacter";
      id: string;
      userId: string;
      characterId: number;
      characterName: string;
      characterImage?: string | null;
      characterStatus?: string | null;
      characterSpecies?: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    info: {
      __typename?: "PageInfo";
      count: number;
      pages: number;
      next?: number | null;
      prev?: number | null;
    };
  };
};

export type FavoriteCharacterQueryVariables = Exact<{
  characterId: Scalars["Int"]["input"];
}>;

export type FavoriteCharacterQuery = {
  __typename?: "Query";
  favoriteCharacter?: {
    __typename?: "FavoriteCharacter";
    id: string;
    userId: string;
    characterId: number;
    characterName: string;
    characterImage?: string | null;
    characterStatus?: string | null;
    characterSpecies?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type FavoriteCharactersByIdsQueryVariables = Exact<{
  characterIds: Array<Scalars["Int"]["input"]> | Scalars["Int"]["input"];
}>;

export type FavoriteCharactersByIdsQuery = {
  __typename?: "Query";
  favoriteCharactersByIds: Array<{
    __typename?: "FavoriteCharacter";
    id: string;
    userId: string;
    characterId: number;
    characterName: string;
    characterImage?: string | null;
    characterStatus?: string | null;
    characterSpecies?: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
};

export type AddFavoriteCharacterMutationVariables = Exact<{
  characterId: Scalars["Int"]["input"];
  characterName: Scalars["String"]["input"];
  characterImage?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type AddFavoriteCharacterMutation = {
  __typename?: "Mutation";
  addFavoriteCharacter: {
    __typename?: "FavoriteCharacter";
    id: string;
    characterId: number;
    characterName: string;
    characterImage?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type RemoveFavoriteCharacterMutationVariables = Exact<{
  characterId: Scalars["Int"]["input"];
}>;

export type RemoveFavoriteCharacterMutation = {
  __typename?: "Mutation";
  removeFavoriteCharacter: boolean;
};

export const CharactersDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Characters" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "page" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "characters" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "page" },
                value: { kind: "Variable", name: { kind: "Name", value: "page" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "results" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "species" } },
                      { kind: "Field", name: { kind: "Name", value: "image" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "info" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      { kind: "Field", name: { kind: "Name", value: "pages" } },
                      { kind: "Field", name: { kind: "Name", value: "next" } },
                      { kind: "Field", name: { kind: "Name", value: "prev" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CharactersQuery, CharactersQueryVariables>;
export const CharacterDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Character" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "character" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "species" } },
                { kind: "Field", name: { kind: "Name", value: "type" } },
                { kind: "Field", name: { kind: "Name", value: "gender" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "origin" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "url" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "location" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "url" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "image" } },
                { kind: "Field", name: { kind: "Name", value: "episode" } },
                { kind: "Field", name: { kind: "Name", value: "created" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CharacterQuery, CharacterQueryVariables>;
export const FavoriteCharactersDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FavoriteCharacters" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "page" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "pageSize" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "favoriteCharacters" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "page" },
                value: { kind: "Variable", name: { kind: "Name", value: "page" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "pageSize" },
                value: { kind: "Variable", name: { kind: "Name", value: "pageSize" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "results" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "userId" } },
                      { kind: "Field", name: { kind: "Name", value: "characterId" } },
                      { kind: "Field", name: { kind: "Name", value: "characterName" } },
                      { kind: "Field", name: { kind: "Name", value: "characterImage" } },
                      { kind: "Field", name: { kind: "Name", value: "characterStatus" } },
                      { kind: "Field", name: { kind: "Name", value: "characterSpecies" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "info" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      { kind: "Field", name: { kind: "Name", value: "pages" } },
                      { kind: "Field", name: { kind: "Name", value: "next" } },
                      { kind: "Field", name: { kind: "Name", value: "prev" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FavoriteCharactersQuery, FavoriteCharactersQueryVariables>;
export const FavoriteCharacterDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FavoriteCharacter" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "characterId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "favoriteCharacter" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "characterId" },
                value: { kind: "Variable", name: { kind: "Name", value: "characterId" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "userId" } },
                { kind: "Field", name: { kind: "Name", value: "characterId" } },
                { kind: "Field", name: { kind: "Name", value: "characterName" } },
                { kind: "Field", name: { kind: "Name", value: "characterImage" } },
                { kind: "Field", name: { kind: "Name", value: "characterStatus" } },
                { kind: "Field", name: { kind: "Name", value: "characterSpecies" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FavoriteCharacterQuery, FavoriteCharacterQueryVariables>;
export const FavoriteCharactersByIdsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FavoriteCharactersByIds" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "characterIds" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "favoriteCharactersByIds" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "characterIds" },
                value: { kind: "Variable", name: { kind: "Name", value: "characterIds" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "userId" } },
                { kind: "Field", name: { kind: "Name", value: "characterId" } },
                { kind: "Field", name: { kind: "Name", value: "characterName" } },
                { kind: "Field", name: { kind: "Name", value: "characterImage" } },
                { kind: "Field", name: { kind: "Name", value: "characterStatus" } },
                { kind: "Field", name: { kind: "Name", value: "characterSpecies" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FavoriteCharactersByIdsQuery, FavoriteCharactersByIdsQueryVariables>;
export const AddFavoriteCharacterDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddFavoriteCharacter" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "characterId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "characterName" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "characterImage" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addFavoriteCharacter" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "characterId" },
                value: { kind: "Variable", name: { kind: "Name", value: "characterId" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "characterName" },
                value: { kind: "Variable", name: { kind: "Name", value: "characterName" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "characterImage" },
                value: { kind: "Variable", name: { kind: "Name", value: "characterImage" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "characterId" } },
                { kind: "Field", name: { kind: "Name", value: "characterName" } },
                { kind: "Field", name: { kind: "Name", value: "characterImage" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AddFavoriteCharacterMutation, AddFavoriteCharacterMutationVariables>;
export const RemoveFavoriteCharacterDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "RemoveFavoriteCharacter" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "characterId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "removeFavoriteCharacter" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "characterId" },
                value: { kind: "Variable", name: { kind: "Name", value: "characterId" } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RemoveFavoriteCharacterMutation,
  RemoveFavoriteCharacterMutationVariables
>;
