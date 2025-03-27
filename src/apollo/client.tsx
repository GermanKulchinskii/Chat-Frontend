// Для запросов через ApolloClient.

import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ReactNode } from 'react';

const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

interface ApolloWrapperProps {
  children: ReactNode;
};

export const ApolloWrapper: React.FC<ApolloWrapperProps> = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
