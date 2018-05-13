// @flow

import { graphql, GraphQLError } from "graphql";
import { toGlobalId } from "graphql-relay";
import NodeFetcher from "./index";

import schema from "./testSchema";

const query = `
query node($id: ID!) {
  node(id: $id) {
      id
      __typename
  }
}
`;

const mutation = `
mutation edit($userId: ID!, $newName: String!) {
    editUser(userId: $userId, newName: $newName) {
        id
        name
    }
}
`;

it("retrieves the node if the id is correct", async () => {
  const variables = { id: toGlobalId("User", "1") };

  expect(await graphql(schema, query, null, null, variables)).toEqual({
    data: {
      node: {
        id: toGlobalId("User", "1"),
        __typename: "User"
      }
    }
  });
});

it("errors if the id is invalid", async () => {
  const variables = {
    id: "_wrong_"
  };

  expect(await graphql(schema, query, null, null, variables)).toEqual({
    data: {
      node: null
    },
    errors: [
      new GraphQLError(
        "Could not resolve to a node with the global id of '_wrong_'."
      )
    ]
  });
});

it("errors if no node for a valid id", async () => {
  const variables = {
    id: toGlobalId("User", "500")
  };
  expect(await graphql(schema, query, null, null, variables)).toEqual({
    data: {
      node: null
    },
    errors: [
      new GraphQLError(
        "Could not resolve to a node with the global id of 'VXNlcjo1MDA='."
      )
    ]
  });
});

it("performs the mutation", async () => {
  const variables = {
    userId: toGlobalId("User", "1"),
    newName: "Michael"
  };

  expect(await graphql(schema, mutation, null, null, variables)).toEqual({
    data: {
      editUser: {
        id: toGlobalId("User", "1"),
        name: "Michael"
      }
    }
  });
});

it("errors if the id is incorrect", async () => {
  const variables = {
    userId: "_wrong_",
    newName: "Michael"
  };

  expect(await graphql(schema, mutation, null, null, variables)).toEqual({
    data: {
      editUser: null
    },
    errors: [
      new GraphQLError(
        "Could not resolve to a node with the global id of '_wrong_'."
      )
    ]
  });
});

it("errors if no node for a valid id", async () => {
  const variables = {
    userId: toGlobalId("User", "500"),
    newName: "Michael"
  };

  expect(await graphql(schema, mutation, null, null, variables)).toEqual({
    data: {
      editUser: null
    },
    errors: [
      new GraphQLError(
        "Could not resolve to a User node with the global id of 'VXNlcjo1MDA='."
      )
    ]
  });
});

it("errors if node is not of the expected type", async () => {
  const variables = {
    userId: toGlobalId("Pet", "500"),
    newName: "Michael"
  };

  expect(await graphql(schema, mutation, null, null, variables)).toEqual({
    data: {
      editUser: null
    },
    errors: [
      new GraphQLError(
        "Could not resolve to a User node with the global id of 'UGV0OjUwMA=='."
      )
    ]
  });
});
