"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserById = exports.removeUser = exports.addUser = exports.nameExists = exports.validateName = exports.users = void 0;
var validate_1 = require("./utils/validate");
//all active users will be stored here
exports.users = [];
//will return true if name is valid
exports.validateName = function (name) {
    var isWhiteSpace = validate_1.IsNullOrWhitespace(name);
    if (!name || isWhiteSpace)
        return false;
    var regex = /^([A-Za-z0-9 _-]+)*$/gi;
    return regex.test(name);
};
//if name already exists, returns userObj, otherwise undefined
exports.nameExists = function (name) {
    var regex = /\s+/g;
    var newName = name.replace(regex, '').toLocaleLowerCase();
    var usernameTaken = exports.users.find(function (user) { return user.name.replace(regex, '').toLocaleLowerCase() === newName; });
    return usernameTaken;
};
//registeres User. returns userObj or errorObj if name isntvalid or already exists
exports.addUser = function (_a) {
    var name = _a.name, id = _a.id;
    var validName = exports.validateName(name);
    if (!validName)
        return { error: 'Invalid nickname, can only contain letters, numbers and " _-"' };
    var userExists = exports.nameExists(name);
    if (userExists)
        return { error: 'Nickname taken, please try another' };
    exports.users.push({ name: name, id: id });
    return { name: name, id: id };
};
// Removes user. returns user if user exists, else returns errorObj
exports.removeUser = function (id) {
    var index = exports.users.findIndex(function (user) { return user.id === id; });
    if (index !== -1)
        return exports.users.splice(index, 1)[0];
    return { error: 'Could not find user' };
};
//finds user by id, returns userObj or else undefined if not found
exports.findUserById = function (id) { return exports.users.find(function (user) { return user.id === id; }); };
