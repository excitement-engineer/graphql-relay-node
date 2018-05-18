# GraphQL-relay-node

Simplify managing global ids used in graphql-relay

> A basic understanding of GraphQL and relay-compliant schemas is needed to provide context for this library.

##Install

Install using the command:

```
npm install --save graphql-relay-node
```

## Motivation

[Graphql-relay](https://github.com/graphql/graphql-relay-js) creates a global id for use in the graphql schema by concatenating the graphql type and the id of the node using the methods `fromGlobalId` and `toGlobalId`.

In a relay compliant schema it is common to use these global ids in order to perform mutations on specific node. Consider the following mutation:

```graphql
type Mutation {
    editUser(userId: ID!, newName: String!) User
}

type User implements Node {
    id: ID!
    name: String!
}
```

As input this mutation expects a `userId` which is a global id.

Typically the resolver for this mutation would be implemented as follows:

```js
resolve = async (_, args) => {
  const { userId, newName } = args;

  const { type, id } = fromGlobalId(userId);

  if (type !== "User" || !id) {
    throw new Error("Invalid user id");
  }

  const user = await fetchUser(id);

  if (!user) {
    throw new Error("No user found");
  }

  // ...mutate data

  return user;
};
```

The example above shows that there is quite a lot of code involved to parse the userId and perform all the relevant checks. These checks can get quite tedious and become inconsistent when implemented across many different mutations.

This library aims to solve this problem by creating a simple API for retrieving a node from a global id.

The first step is define a `NodeFetcher` instance. This class performs all the necessary error handling when working with global ids and will return the node to the mutation resolver.

```js
//nodeFetcher.js

import { fromGlobalId } from "graphql-relay";
import NodeFetcher from "graphql-relay-node";

const idFetcher = ({ type, id }) => {
  if (type === "User") {
    return fetchUser(id);
  }
};

const nodeFetcher = new NodeFetcher({
  fromGlobalId,
  idFetcher
});

export default nodeFetcher;
```

Next, we import the `nodeFetcher` in the resolver of the mutation and pass the global id and the expected Node type (`"User"` in this case). The `fetch` method returns the node associated with the global id. All the error handling is done by the `NodeFetcher` class.

```js
import nodeFetcher from "./nodeFetcher";

resolve = async (_, args) => {
  const user = await nodeFetcher.fetch(userId, "User");

  // ...mutate data

  return user;
};
```

This instance of `nodeFetcher` can be used to retrieve nodes of a specific type in each mutation. This ensures that error handling is consistent and implemented only once.

Finally, you can use the `nodeFetcher` in the resolver for the `node` query. In this case we don't pass an expected node type as the second argument to the `fetch` function.

```graphql
type Query {
  node(id: ID!): Node
}
```

```js
import { nodeDefinitions } from "graphql-relay";
import nodeFetcher from "./nodeFetcher";

const nodeDefinition = nodeDefinitions((globalId, context, info) => {
  return nodeFetcher.fetch(globalId);
});
```

## API

This library exports the `NodeHelper` class.

### Constructor

The constructor takes a `Config` object with the following properties:

```js
type Config = {
  idFetcher: (resolvedId: ResolvedGlobalId) => any,
  fromGlobalId: (globalId: string) => ResolvedGlobalId,
  customError?: Class<Error>
};

type ResolvedGlobalId = {
  type: string,
  id: string
};
```

* `idFetcher`: Responsible for fetching a node associated with a `type` and `id`.
* `fromGlobalId`: Converts a globalId to a `type` and `error` (you would typically pass graphql-relay's default implementation but you can use your own).
* `customError`: By default this library throws an instance of `Error` when an error occurs parsing the global id. However, some libraries (such as [graphql-errors](https://github.com/kadirahq/graphql-errors)) introduce custom errors to distinguish between internal server errors and errors that need to be displayed to users of the API. Pass a custom error to allow for this use case.

### fetch(globalId: String, expectedNodeType?: ?String): Promise<any>

The `fetch` call retrieves the node associated with the `globalId`.

* `globalId`: The global id of the node
* `expectedNodeType`: Optional string representing the expected node type that must be fetched.
