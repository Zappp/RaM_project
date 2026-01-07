import { gql } from 'graphql-tag';

export const MeQuery = gql`
  query Me {
    me {
      id
      email
      emailVerified
    }
  }
`;

export const SignupMutation = gql`
  mutation Signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      id
      email
      emailVerified
    }
  }
`;

export const LoginMutation = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        email
        emailVerified
      }
      token
    }
  }
`;

export const LogoutMutation = gql`
  mutation Logout {
    logout
  }
`;

