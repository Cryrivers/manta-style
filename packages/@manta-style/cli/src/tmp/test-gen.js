"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.APIResponse = undefined;

var _runtime = require("@manta-style/runtime");

var _runtime2 = _interopRequireDefault(_runtime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserResponse = _runtime2.default.TypeLiteral(function (type) {
    var T = type.RefType("T");
    type.property("status", _runtime2.default.UnionType([_runtime2.default.LiteralType("ok"), _runtime2.default.LiteralType("fail")]), false);
    type.property("balance", _runtime2.default.NumberKeyword, false);
    type.property("testAccount", _runtime2.default.BooleanKeyword, true);
    type.property("testGeneric", T, false);
});
var APIResponse = exports.APIResponse = _runtime2.default.TypeLiteral(function (type) {
    type.property("data1", _runtime2.default.ArrayType(_runtime2.default.NumberKeyword), false);
    type.property("data2", _runtime2.default.ArrayType(UserResponse.ref([_runtime2.default.NumberKeyword])), false);
});