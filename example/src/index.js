// @flow

const express = require("express");
const graphqlHTTP = require("express-graphql");
import Schema from "./schema";

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: Schema,
    graphiql: true
  })
);

app.listen(3000);
