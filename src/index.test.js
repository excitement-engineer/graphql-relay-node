// @flow

import { fromGlobalId, toGlobalId } from "graphql-relay";
import NodeFetcher from "./index";

const nodeFetcher = new NodeFetcher({
  fromGlobalId,
  idFetcher: ({ id, type }) => undefined,
  customError: SyntaxError
});

it("allows for passing custom error classes", async () => {
  expect.assertions(4);

  try {
    await nodeFetcher.fetch("bla");
  } catch (error) {
    expect(error instanceof SyntaxError).toBe(true);
    expect(error).toEqual(
      new SyntaxError(
        "Could not resolve to a node with the global id of 'bla'."
      )
    );
  }

  try {
    await nodeFetcher.fetch(toGlobalId("PEt", "1"), "User");
  } catch (error) {
    expect(error instanceof SyntaxError).toBe(true);
    expect(error).toEqual(
      new SyntaxError(
        "Could not resolve to a User node with the global id of 'UEV0OjE='."
      )
    );
  }
});
