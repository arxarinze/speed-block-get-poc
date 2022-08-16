import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { router } from './src/router/router';
import cors from 'cors';

dotenv.config();

export const app: Express = express();
const port = process.env.PORT!;

const allowedOrigins:string[] = ['*']; //* is included for development purposes only

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

// Then pass these options to cors:
app.use(cors(options));

app.use(express.json());
app.use('/api', router);

app.listen(port!, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
