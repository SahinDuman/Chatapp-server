interface User {
  name: string,
  id?: string
}

let users: User[] = [];

export const addUser = ({name}:any) => {  
  const usernameTaken = users.find(user => user.name === name);
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
    console.log(userObj);
    return userObj;
  } 
}

export const removeUser = (id:string) => {
  const index = users.findIndex(user => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

export const findUserById = (id:string) => users.find((user:User) => user.id === id);

const trimName = (name:string) => name.trim().toLocaleLowerCase();
