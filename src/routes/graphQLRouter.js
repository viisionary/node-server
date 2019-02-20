import { merge } from 'lodash'
import { ApolloServer, gql } from 'apollo-server-express'

import { userResolvers } from "../graphql/users";

const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        desc: String!
    }

    input UpdatedUser {
        name:String!, desc:String!, userId:String!
    }

    type Query {
        getUser(name: String!): User!
    }

    type Mutation {
        updateUser(match: UpdatedUser!, value: UpdatedUser! ): User!
        createUser(name:String!, desc:String!, userId:String!): User!
    }
`;

const resolvers = merge(
  {},
  userResolvers,
);


export const graphqlServer = new ApolloServer({
  typeDefs, resolvers, context: ({ req }) => ({
    req
  })
});
