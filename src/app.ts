import express, {Application, Request, Response} from 'express';

const app: Application = express();

app.get('/', (req: Request, res:Response) => {
  res.send('Hello world from TS-node')
})

app.listen(process.env.PORT || 5000, () => console.log('server running'));