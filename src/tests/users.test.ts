import { addUser, giveUserSocketId, removeUser, findUserById, users} from '../users';

const userAlreadyExists:string = 'Nickname taken, please try another';
const invalidName:string = 'Invalid nickname, can only contain letters, numbers and " _-"';
const userDoesntExist: string = 'No user with that name exists';
const couldNotFindUser:string = 'Could not find user';

const mockUser1 = {name: 'Peter Pevensie', id: 'id1'};
const mockUser2 = {name: 'Susan Pevensie', id: 'id2'};
const mockUser3 = {name: 'Lucy Pevensie', id: 'id3'};
const mockUser4 = {name: 'Edmund Pevensie', id: 'id4'};

beforeEach(() => {
  users.push(    
    {name: 'Peter Pevensie', id: 'id1'},
    {name: 'Susan Pevensie', id: 'id2'},
    {name: 'Lucy Pevensie', id: 'id3'},
    {name: 'Edmund Pevensie', id: 'id4'}
  )
});

afterEach(() => users.splice(0, users.length));


describe('testing addUser', () => {

  test('if addUser properly adds new user', () => {
    expect(addUser({name: 'Eren'})).not.toBe({name: 'Eren'})
    expect(addUser({name: 'Armin'})).toEqual({name: 'Armin'})
    expect(addUser({name: 'Mikasa'})).toEqual({name: 'Mikasa'})
    expect(addUser({name: '1337'})).toEqual({name: '1337'})
    expect(addUser({name: '1337-elite'})).toEqual({name: '1337-elite'})
  })

  test('if addUser gives back correct error message if user already exists', () => {
    expect(addUser({name: 'Peter Pevensie'})).toEqual({error: userAlreadyExists})
    expect(addUser({name: 'P  eter Pevensie'})).toEqual({error: userAlreadyExists})
    expect(addUser({name: 'PETER PEVENSIE'})).toEqual({error: userAlreadyExists})
  })

  test('if addUser gives back correct error message if name is invalid', () => {
    expect(addUser({name: 'Peter.Pevensie'})).toEqual({error: invalidName})
    expect(addUser({name: ' '})).toEqual({error: invalidName})
    expect(addUser({name: 'Peter+-2.'})).toEqual({error: invalidName})
  })
});


describe('testing giveUserSocketId', () => {

  test('test if giveUserSocketId properly adds an id to the user object', () => {
    expect(giveUserSocketId(mockUser1.name, mockUser1.name + '-id')).toEqual({name: mockUser1.name, id: mockUser1.name + '-id'})
    expect(giveUserSocketId(mockUser2.name, mockUser2.name + '-id')).toEqual({name: mockUser2.name, id: mockUser2.name + '-id'})
    expect(giveUserSocketId(mockUser3.name, mockUser3.name + '-id')).toEqual({name: mockUser3.name, id: mockUser3.name + '-id'})
    expect(giveUserSocketId(mockUser4.name, mockUser4.name + '-id')).toEqual({name: mockUser4.name, id: mockUser4.name + '-id'})
  })

  test('test if giveUserSocketId gives back correct error message if user doesnt exist', () => {
    expect(giveUserSocketId('random user', 'random user id')).toEqual({error: userDoesntExist})
    expect(giveUserSocketId('random user 2', 'random user id')).toEqual({error: userDoesntExist})
    expect(giveUserSocketId('random user 3', 'random user id')).toEqual({error: userDoesntExist})
  })
});


describe('testing removeUser', () => {

  test('test if removeUser properly removes user', () => {
    expect(removeUser(mockUser1.id)).toEqual(mockUser1)
    expect(removeUser(mockUser2.id)).toEqual(mockUser2)
    expect(removeUser(mockUser3.id)).toEqual(mockUser3)
  })

  test('test if removeUser gives back correct error message if id doesnt match any users', () => {
    expect(removeUser('randomid1')).toEqual({error: couldNotFindUser})
    expect(removeUser('randomid1')).toEqual({error: couldNotFindUser})
    expect(removeUser('randomid1')).toEqual({error: couldNotFindUser})
  })
});


describe('testing findUserById', () => {

  test('test if findUserById finds a user by id', () => {
    expect(findUserById(mockUser1.id)).toEqual(mockUser1);
    expect(findUserById(mockUser2.id)).toEqual(mockUser2);
    expect(findUserById(mockUser3.id)).toEqual(mockUser3);
  })

  test('test if findUserById finds a user by id', () => {
    expect(findUserById('random id')).toEqual(undefined);
    expect(findUserById('random id 2')).toEqual(undefined);
    expect(findUserById('random id 3')).toEqual(undefined);
  })
});