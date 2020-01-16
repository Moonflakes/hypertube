import { ApolloClient, } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';
import { onError } from "apollo-link-error";
import { setContext } from 'apollo-link-context';
import gql from 'graphql-tag';

const cache = new InMemoryCache({
  addTypename: true,
  dataIdFromObject: object => {
    switch (object.__typename) {
      case 'Movie': return object.imdbID;
      case 'Person': return object.nameID;
      default: return defaultDataIdFromObject(object);
    }
  }
});

const initCache = () => cache.writeData({
  data: {
    isLogged: !!localStorage.getItem('token'),
    filters: {
      title: "",
      releaseDate: [1964, 2019],
      userRating: [1, 10],
      genres: [],
      startId: "1",
      sort: 'alpha,asc',
      __typename: "Filters"
    }
  }
});

const link = ApolloLink.from([
  onError(({ graphQLErrors, response }) => {
    if (graphQLErrors && graphQLErrors[0].message === "UNAUTHENTICATED") {
      localStorage.removeItem('token');
      document.location.reload(true);
    }
  }),
  setContext(() => {
    let headers = {};
    let token = localStorage.getItem('token');
    let language  = localStorage.getItem('i18nextLng');

    if (token)
      headers.authorization = token;
    if (language)
      headers['Accept-Language'] = language;

      return { headers };
  }),
  new HttpLink({ uri: `${process.env.REACT_APP_API_HOST}/graphql` }),
]);

const client = new ApolloClient({
  link,
  cache,
  resolvers: {
    Mutation: {
      login: (_, { accessToken, ...p }, { cache }) => {
        localStorage.setItem('token', accessToken);
        cache.writeData({ data: { isLogged: true }});
        return null
      },
      logout: () => {
        localStorage.removeItem('token');
        client.resetStore()
        return null;
      },
      updateFilters: (_, { filters }, { cache }) => {
        cache.writeData({
          data: {
            filters
          }
        })

        return Promise.resolve();
      }
    }
  },
});

initCache();
client.onResetStore(initCache)

export const LOGIN_LOCAL_MUTATION  = gql`
  mutation login($accessToken: String) {
      login(accessToken: $accessToken) @client
  }
`

export const LOGOUT_LOCAL_MUTATION  = gql`
  mutation logout {
      logout @client
  }
`

export const IS_LOGGED_LOCAL_QUERY = gql`
  query isLogged {
      isLogged @client
  }
`

export const FILTERS_LOCAL_MUTATION  = gql`
  mutation updateFilters($filters: Filters) {
    updateFilters(filters: $filters) @client
  }
`

export const FILTERS_LOCAL_QUERY = gql`
  query getFilters {
      filters @client {
        sort 
        genres
        title
        userRating
        releaseDate
      }
  }
`

export default client;