import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      accessToken
      refreshToken
    }
  }
`;