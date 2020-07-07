"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var users_1 = require("../users");
var userAlreadyExists = 'Nickname taken, please try another';
var invalidName = 'Invalid nickname, can only contain letters, numbers and " _-"';
var userDoesntExist = 'No user with that name exists';
var couldNotFindUser = 'Could not find user';
var mockUser1 = { name: 'Peter Pevensie', id: 'id1' };
var mockUser2 = { name: 'Susan Pevensie', id: 'id2' };
var mockUser3 = { name: 'Lucy Pevensie', id: 'id3' };
var mockUser4 = { name: 'Edmund Pevensie', id: 'id4' };
beforeEach(function () {
    users_1.users.push({ name: 'Peter Pevensie', id: 'id1' }, { name: 'Susan Pevensie', id: 'id2' }, { name: 'Lucy Pevensie', id: 'id3' }, { name: 'Edmund Pevensie', id: 'id4' });
});
afterEach(function () { return users_1.users.splice(0, users_1.users.length); });
describe('testing validateName', function () {
    test('test if true when sending "proper" nicknames', function () {
        expect(users_1.validateName('Eren')).toBeTruthy();
        expect(users_1.validateName('Eren123')).toBeTruthy();
        expect(users_1.validateName('123')).toBeTruthy();
        expect(users_1.validateName('123Eren')).toBeTruthy();
        expect(users_1.validateName('123-Eren')).toBeTruthy();
        expect(users_1.validateName('_Mikasa')).toBeTruthy();
        expect(users_1.validateName('Armin--')).toBeTruthy();
        expect(users_1.validateName('Ar min')).toBeTruthy();
        expect(users_1.validateName('Ar- min')).toBeTruthy();
        expect(users_1.validateName('Arm__in')).toBeTruthy();
        expect(users_1.validateName('Arm__in')).toBeTruthy();
        expect(users_1.validateName('Arm__in')).toBeTruthy();
        expect(users_1.validateName('     Arm__i     n   ')).toBeTruthy();
        expect(users_1.validateName('     A ')).toBeTruthy();
        expect(users_1.validateName('     Arm__i     n   ')).toBeTruthy();
    });
    test('test if false if not valid', function () {
        expect(users_1.validateName('.Eren')).toBeFalsy();
        expect(users_1.validateName('.')).toBeFalsy();
        expect(users_1.validateName('')).toBeFalsy();
        expect(users_1.validateName('      ')).toBeFalsy();
        expect(users_1.validateName(' .+ ')).toBeFalsy();
    });
});
describe('testing nameExists', function () {
    test('test if false when name doesnt already exist', function () {
        expect(users_1.nameExists('Eren')).toBeFalsy();
        expect(users_1.nameExists('Mikasa')).toBeFalsy();
        expect(users_1.nameExists('Armin')).toBeFalsy();
    });
    test('test if true when name already exists', function () {
        expect(users_1.nameExists('Peter Pevensie')).toBeTruthy();
        expect(users_1.nameExists('Peter Peve     nsie')).toBeTruthy();
        expect(users_1.nameExists('PETERPEVENSIE')).toBeTruthy();
        expect(users_1.nameExists('PETERP    EVENSIE')).toBeTruthy();
        expect(users_1.nameExists('PETE  RPEVE  NSIE')).toBeTruthy();
    });
});
describe('testing addUser', function () {
    test('if addUser properly adds new user', function () {
        expect(users_1.addUser({ name: 'Eren', id: '5' })).not.toBe({ name: 'Eren', id: '5' });
        expect(users_1.addUser({ name: 'Armin', id: '6' })).toEqual({ name: 'Armin', id: '6' });
        expect(users_1.addUser({ name: 'Mikasa', id: '7' })).toEqual({ name: 'Mikasa', id: '7' });
        expect(users_1.addUser({ name: '1337', id: '8' })).toEqual({ name: '1337', id: '8' });
        expect(users_1.addUser({ name: '1337-elite', id: '9' })).toEqual({ name: '1337-elite', id: '9' });
    });
    test('if addUser gives back correct error message if user already exists', function () {
        expect(users_1.addUser({ name: 'Peter Pevensie', id: '1' })).toEqual({ error: userAlreadyExists });
        expect(users_1.addUser({ name: 'P  eter Pevensie', id: '2' })).toEqual({ error: userAlreadyExists });
        expect(users_1.addUser({ name: 'PETER PEVENSIE', id: '3' })).toEqual({ error: userAlreadyExists });
    });
    test('if addUser gives back correct error message if name is invalid', function () {
        expect(users_1.addUser({ name: 'Peter.Pevensie', id: '1' })).toEqual({ error: invalidName });
        expect(users_1.addUser({ name: ' ', id: '2' })).toEqual({ error: invalidName });
        expect(users_1.addUser({ name: 'Peter+-2.', id: '2' })).toEqual({ error: invalidName });
    });
});
describe('testing removeUser', function () {
    test('test if removeUser properly removes user', function () {
        expect(users_1.removeUser(mockUser1.id)).toEqual(mockUser1);
        expect(users_1.removeUser(mockUser2.id)).toEqual(mockUser2);
        expect(users_1.removeUser(mockUser3.id)).toEqual(mockUser3);
    });
    test('test if removeUser gives back correct error message if id doesnt match any users', function () {
        expect(users_1.removeUser('randomid1')).toEqual({ error: couldNotFindUser });
        expect(users_1.removeUser('randomid1')).toEqual({ error: couldNotFindUser });
        expect(users_1.removeUser('randomid1')).toEqual({ error: couldNotFindUser });
    });
});
describe('testing findUserById', function () {
    test('test if findUserById finds a user by id', function () {
        expect(users_1.findUserById(mockUser1.id)).toEqual(mockUser1);
        expect(users_1.findUserById(mockUser2.id)).toEqual(mockUser2);
        expect(users_1.findUserById(mockUser3.id)).toEqual(mockUser3);
    });
    test('test if findUserById finds a user by id', function () {
        expect(users_1.findUserById('random id')).toEqual(undefined);
        expect(users_1.findUserById('random id 2')).toEqual(undefined);
        expect(users_1.findUserById('random id 3')).toEqual(undefined);
    });
});
