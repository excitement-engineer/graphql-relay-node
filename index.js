"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NodeFetcher = function () {
  function NodeFetcher(config) {
    (0, _classCallCheck3.default)(this, NodeFetcher);

    this._fromGlobalId = config.fromGlobalId;
    this._customError = config.customError || Error;
    this._idFetcher = config.idFetcher;
  }

  (0, _createClass3.default)(NodeFetcher, [{
    key: "fetch",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(globalId, expectedNodeType) {
        var resolvedId, type, id, node;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                resolvedId = this._fromGlobalId(globalId);
                type = resolvedId.type, id = resolvedId.id;

                if (type && id) {
                  _context.next = 4;
                  break;
                }

                throw this._nodeNotFoundError(globalId);

              case 4:
                if (!(expectedNodeType && expectedNodeType !== type)) {
                  _context.next = 6;
                  break;
                }

                throw this._nodeNotTypeFoundError(globalId, expectedNodeType);

              case 6:
                _context.next = 8;
                return Promise.resolve(this._idFetcher(resolvedId));

              case 8:
                node = _context.sent;

                if (node) {
                  _context.next = 13;
                  break;
                }

                if (!expectedNodeType) {
                  _context.next = 12;
                  break;
                }

                throw this._nodeNotTypeFoundError(globalId, expectedNodeType);

              case 12:
                throw this._nodeNotFoundError(globalId);

              case 13:
                return _context.abrupt("return", node);

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetch(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "_nodeNotFoundError",
    value: function _nodeNotFoundError(globalId) {
      return new this._customError("Could not resolve to a node with the global id of '" + globalId + "'.");
    }
  }, {
    key: "_nodeNotTypeFoundError",
    value: function _nodeNotTypeFoundError(globalId, type) {
      return new this._customError("Could not resolve to a " + String(type) + " node with the global id of '" + globalId + "'.");
    }
  }]);
  return NodeFetcher;
}();

exports.default = NodeFetcher;
