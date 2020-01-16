// import BigInt from 'graphql-bigint'

import userResolvers from './User';
import movieResolvers from './Movie';
import BigInt from './BigInt'

const resolvers = {
    Query: {
      ...userResolvers.queries,
      ...movieResolvers.queries
    },
    Mutation: {
      ...userResolvers.mutations,
      ...movieResolvers.mutations
    },
    Movie: movieResolvers.types,
    User: userResolvers.types,
    BigInt,
};

export default resolvers;