let users: string[] = [];

export const addUser = ( name:string) => {
  name = name.trim().toLocaleLowerCase();
  
  const usernameTaken = users.find(user => user === name);
  if(usernameTaken) return {error: 'Nickname taken, please try another'};

  users.push(name)
  return {name}
}