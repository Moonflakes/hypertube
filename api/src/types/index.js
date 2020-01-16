import { gql } from 'apollo-server-express';

import { types as userTypes, queries as userQueries, mutations as userMutations } from './User';
import { types as movieTypes, queries as movieQueries, mutations as movieMutations } from './Movie';

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  interface Node {
    id: ID!
  }

  scalar BigInt

  # This type defines the queryable fields for every book in our data source.
  ${userTypes}
  ${movieTypes}

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    ${userQueries}
    ${movieQueries}
  }

  type Mutation {
    ${userMutations}
    ${movieMutations}
  }
`;

export default typeDefs;