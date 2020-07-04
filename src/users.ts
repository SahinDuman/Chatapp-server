let users: string[] = [];

export const addUser = ({name}:any) => {
  console.log('addUser', name);
  name = name.trim().toLocaleLowerCase();
  
  const usernameTaken = users.find(user => user === name);
  if(usernameTaken) return {error: 'Nickname taken, please try another'};

  users.push(name)
  console.log('USERS', users);
  return {user: name}
}