import {  User, ErrorObj } from './models';
import { IsNullOrWhitespace } from './utils/validate';

//all active users will be stored here
export let users: (User)[] = [];

//will return true if name is valid
export const validateName = (name:string) => {
  const isWhiteSpace = IsNullOrWhitespace(name);
  if(!name || isWhiteSpace) return false;

  const regex = /^([A-Za-z0-9 _-]+)*$/gi;
  return regex.test(name);
}

//if name already exists, returns userObj, otherwise undefined
export const nameExists = (name:string) => {
  const regex = /\s+/g;
  const newName = name.replace(regex, '').toLocaleLowerCase();

  const usernameTaken = users.find((user:User) => user.name.replace(regex, '').toLocaleLowerCase() === newName);

  return usernameTaken;
}

//registeres User. returns userObj or errorObj if name isntvalid or already exists
export const addUser = ({name, id}:User) => {
  const validName:boolean = validateName(name);
  
  if(!validName) return {error: 'Invalid nickname, can only contain letters, numbers and " _-"'}

  const userExists = nameExists(name);

  if(userExists) return {error: 'Nickname taken, please try another'};

  users.push({name, id})
  return {name, id}
}

// Removes user. returns user if user exists, else returns errorObj
export const removeUser = (id:string):User|ErrorObj => {
  const index:number = users.findIndex(user => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];

  return {error: 'Could not find user'}
}

//finds user by id, returns userObj or else undefined if not found
export const findUserById = (id:string):User|undefined => users.find((user) => user.id === id);