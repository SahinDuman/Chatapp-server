import express, { Request, Response} from 'express';
import { addUser, nameExists, validateName } from './users';
import { logger } from './utils/logger'
const router = express.Router();

/* router.get("/", (req: Request, res:Response) => {
  res.send({ response: "Server is up and running." }).status(200);
});
 */

router.post("/register", (req: Request, res:Response) => {
  const name = req.body.name;
  const nameValid = validateName(name);
  const doesNameExist = nameExists(name);
  logger.info('RECIEVED A POST REQUEST FROM /register', req.body);
  
  if(!nameValid || doesNameExist) {
    res.send({error: 'Nickname taken, please try another'});
  } else {
    res.send({name, error: false})
  }
});

export default router;