import { addUser, removeUser, findUserById, users, validateName, nameExists} from '../users';
import { User } from '../models';

const userAlreadyExists:string = 'Nickname taken, please try another';
const invalidName:string = 'Invalid nickname, can only contain letters, numbers and " _-"';
const userDoesntExist: string = 'No user with that name exists';
const couldNotFindUser:string = 'Could not find user';

const mockUser1:User = {name: 'Peter Pevensie', id: 'id1'};
const mockUser2:User = {name: 'Susan Pevensie', id: 'id2'};
const mockUser3:User = {name: 'Lucy Pevensie', id: 'id3'};
const mockUser4:User = {name: 'Edmund Pevensie', id: 'id4'};


beforeEach(() => {
  users.push(    
    {name: 'Peter Pevensie', id: 'id1'},
    {name: 'Susan Pevensie', id: 'id2'},
    {name: 'Lucy Pevensie', id: 'id3'},
    {name: 'Edmund Pevensie', id: 'id4'}
  )
});

afterEach(() => users.splice(0, users.length));

describe('testing validateName',() => {
  test('test if true when sending "proper" nicknames', () => {
    expect(validateName('Eren')).toBeTruthy()
    expect(validateName('Eren123')).toBeTruthy()
    expect(validateName('123')).toBeTruthy()
    expect(validateName('123Eren')).toBeTruthy()
    expect(validateName('123-Eren')).toBeTruthy()
    expect(validateName('_Mikasa')).toBeTruthy()
    expect(validateName('Armin--')).toBeTruthy()
    expect(validateName('Ar min')).toBeTruthy()
    expect(validateName('Ar- min')).toBeTruthy()
    expect(validateName('Arm__in')).toBeTruthy()
    expect(validateName('Arm__in')).toBeTruthy()
    expect(validateName('Arm__in')).toBeTruthy()
    expect(validateName('     Arm__i     n   ')).toBeTruthy()
    expect(validateName('     A ')).toBeTruthy()
    expect(validateName('     Arm__i     n   ')).toBeTruthy()
  })

  test('test if false if not valid', () => {
    expect(validateName('.Eren')).toBeFalsy()
    expect(validateName('.')).toBeFalsy()
    expect(validateName('')).toBeFalsy()
    expect(validateName('      ')).toBeFalsy()
    expect(validateName(' .+ ')).toBeFalsy()  
  })
})

describe('testing nameExists', () => {
  test('test if false when name doesnt already exist', () => {
    expect(nameExists('Eren')).toBeFalsy();
    expect(nameExists('Mikasa')).toBeFalsy();
    expect(nameExists('Armin')).toBeFalsy();
  })

  test('test if true when name already exists', () => {
    expect(nameExists('Peter Pevensie')).toBeTruthy();
    expect(nameExists('Peter Peve     nsie')).toBeTruthy();
    expect(nameExists('PETERPEVENSIE')).toBeTruthy();
    expect(nameExists('PETERP    EVENSIE')).toBeTruthy();
    expect(nameExists('PETE  RPEVE  NSIE')).toBeTruthy();
  })
})


describe('testing addUser', () => {

  test('if addUser properly adds new user', () => {
    expect(addUser({name: 'Eren', id:'5'})).not.toBe({name: 'Eren', id:'5'})
    expect(addUser({name: 'Armin', id: '6'})).toEqual({name: 'Armin',id:'6'})
    expect(addUser({name: 'Mikasa', id:'7'})).toEqual({name: 'Mikasa', id:'7'})
    expect(addUser({name: '1337', id:'8'})).toEqual({name: '1337', id:'8'})
    expect(addUser({name: '1337-elite', id:'9'})).toEqual({name: '1337-elite', id:'9'})
  })

  test('if addUser gives back correct error message if user already exists', () => {
    expect(addUser({name: 'Peter Pevensie', id:'1'})).toEqual({error: userAlreadyExists})
    expect(addUser({name: 'P  eter Pevensie', id:'2'})).toEqual({error: userAlreadyExists})
    expect(addUser({name: 'PETER PEVENSIE', id:'3'})).toEqual({error: userAlreadyExists})
  })

  test('if addUser gives back correct error message if name is invalid', () => {
    expect(addUser({name: 'Peter.Pevensie', id:'1'})).toEqual({error: invalidName})
    expect(addUser({name: ' ', id:'2'})).toEqual({error: invalidName})
    expect(addUser({name: 'Peter+-2.', id:'2'})).toEqual({error: invalidName})
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