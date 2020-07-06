import express, { Request, Response} from 'express';
import { addUser } from './users';
import { logger } from './utils/logger'
const router = express.Router();

router.get("/", (req: Request, res:Response) => {
  res.send({ response: "Server is up and running." }).status(200);
});

router.post("/register", (req: Request, res:Response) => {
  const {error, name} = addUser(req.body);
  logger.info('RECIEVED A POST REQUEST FROM /register', req.body)
  if(error) {
    res.send({error});
  } else {
    res.send({name, error: false})
  }
});

export default router;