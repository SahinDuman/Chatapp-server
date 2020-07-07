"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsNullOrWhitespace = void 0;
exports.IsNullOrWhitespace = function (string) {
    if (!string)
        return true;
    return !/\S/g.test(string);
};
