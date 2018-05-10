// @flow

import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLString,
  graphql
} from "graphql";

import {
  nodeDefinitions,
  globalIdField,
  fromGlobalId,
  toGlobalId
} from "graphql-relay";
import NodeFetcher from "graphql-relay-node";

const userData = [
  {
    id: "1",
    name: "John Doe"
  },
  {
    id: "2",
    name: "Jane Smith"
  }
];

const idFetcher = ({ type, id }) => {
  if (type === "User") {
    return userData.find(user => user.id == id);
  }
};

const nodeFetcher = new NodeFetcher({
  fromGlobalId,
  idFetcher
});

const { nodeField, nodesField, nodeInterface } = nodeDefinitions(
  (id, context, info) => {
    return nodeFetcher.fetch(id);
  },
  obj => {
    if (userData[obj.id]) {
      return userType;
    }
  }
);

const userType = new GraphQLObjectType({
  name: "User",
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    name: {
      type: GraphQLString
    }
  })
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    node: nodeField,
    users: {
      type: new GraphQLList(userType),
      resolve: () => userData
    }
  })
});

const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    editUser: {
      type: userType,
      args: {
        userId: {
          type: new GraphQLNonNull(GraphQLID)
        },
        newName: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: async (_, { userId, newName }) => {
        const user = await nodeFetcher.fetch(userId, "User");

        user.name = newName;

        return user;
      }
    }
  })
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
  types: [userType]
});

export default schema;
