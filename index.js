// @flow

type ResolvedGlobalId = {
  type: string,
  id: string
};

type Config = {
  idFetcher: (resolvedId: ResolvedGlobalId) => any,
  fromGlobalId: (globalId: string) => ResolvedGlobalId,
  customError?: Class<Error>
};

export default class NodeFetcher {
  _idFetcher: (resolvedId: ResolvedGlobalId) => any;
  _fromGlobalId: (globalId: string) => ResolvedGlobalId;
  _customError: Class<Error>;

  constructor(config: Config) {
    this._fromGlobalId = config.fromGlobalId;
    this._customError = config.customError || Error;
    this._idFetcher = config.idFetcher;
  }

  async fetch(globalId: string, expectedNodeType?: ?string): Promise<any> {
    const resolvedId = this._fromGlobalId(globalId);
    const { type, id } = resolvedId;

    if (!(type && id)) {
      throw this._nodeNotFoundError(globalId);
    }

    if (expectedNodeType && expectedNodeType !== type) {
      throw this._nodeNotTypeFoundError(globalId, expectedNodeType);
    }

    const node = await Promise.resolve(this._idFetcher(resolvedId));

    if (!node) {
      if (expectedNodeType) {
        throw this._nodeNotTypeFoundError(globalId, expectedNodeType);
      }

      throw this._nodeNotFoundError(globalId);
    }

    return node;
  }

  _nodeNotFoundError(globalId: string): Error {
    return new this._customError(
      `Could not resolve to a node with the global id of '${globalId}'.`
    );
  }

  _nodeNotTypeFoundError(globalId: string, type: string): Error {
    return new this._customError(
      `Could not resolve to ${String(
        type
      )} node with the global id of '${globalId}'.`
    );
  }
}
