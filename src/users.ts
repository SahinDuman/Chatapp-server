export interface User {
  name: string,
  id?: string
}
//all active users will be stored here
export let users: User[] = [];

export const addUser = ({name}:any) => {
  const regex = /^([A-Za-z0-9 _-]+)*$/gi;
  const validName = regex.test(name.trim());
  
  if(!validName || !name.trim()) return {error: 'Invalid nickname, can only contain letters, numbers and " _-"'}

  const usernameTaken = users.find(user => {
    const registeredName = user.name.replace(/\s+/g, '').toLocaleLowerCase();
    const newName = name.replace(/\s+/g, '').toLocaleLowerCase();

    if (registeredName === newName) return true;
    return false;
  });

  if(usernameTaken) return {error: 'Nickname taken, please try another'};

  users.push({name})
  return {name}
}

export const giveUserSocketId = (name:string, id:string) => {
  const index = users.findIndex(user => user.name === name);

  if(index !== -1) {
    const userObj = users.splice(index, 1)[0];
    userObj.id = id;

    users = [...users, userObj];
    return userObj;
  }
  return {error: 'No user with that name exists'};
}

export const removeUser = (id:string) => {
  const index = users.findIndex(user => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];

  return {error: 'Could not find user'}
}

export const findUserById = (id:string) => users.find((user:User) => user.id === id);