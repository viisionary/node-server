import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt, GraphQLString
} from 'graphql';
import { searchPerson } from "../db/query";

let count = 0;

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      account: {
        type: GraphQLInt,
        resolve: function() {
          return count;
        }
      },
      name: {
        // id: ID,
        type: GraphQLString,
        resolve: function() {
          return 'name';
        }
      },
      type: {
        type: GraphQLString,
        resolve: function(params) {
          console.log(params);
          searchPerson().then(websites =>{
            console.log(websites);
          });
          return 'type';
        }
      }
    }
  })
});

export default schema;
