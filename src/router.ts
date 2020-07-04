import express, { Request, Response} from 'express';
import { addUser } from './users';
const router = express.Router();

router.get("/", (req: Request, res:Response) => {
  res.send({ response: "Server is up and running." }).status(200);
});

router.post("/register", (req: Request, res:Response) => {
  console.log('reqbody:::', req.body);
  const user = addUser(req.body);
  if(user.error) {
    res.send({error: user.error})
  } else {
    res.send({name: user.user, error: false})
  }
});

export default router;