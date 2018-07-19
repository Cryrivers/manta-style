"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _runtime = require("@manta-style/runtime");

var _runtime2 = _interopRequireDefault(_runtime);

var _testGen = require("./test-gen");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Config = _runtime2.default.TypeLiteral(function (type) {
    type.property("\"/test\"", _runtime2.default.TypeLiteral(function (type) {
        type.property("haha", _runtime2.default.UnionType([_runtime2.default.LiteralType(0), _runtime2.default.LiteralType(1), _runtime2.default.LiteralType("string")]), false);
    }), false);
    type.property("\"/user\"", _testGen.APIResponse, false);
});
exports.default = Config;