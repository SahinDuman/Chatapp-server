import { addUser, giveUserSocketId, removeUser, findUserById} from '../users';

const userAlreadyExists:string = 'Nickname taken, please try another';
const invalidName:string = 'Invalid nickname, can only contain letters, numbers and " _-"';

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
})


