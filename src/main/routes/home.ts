import { Application } from 'express';

export const WELCOME_MESSAGE = 'Welcome to the Message Cron Service REST';
export default function (app: Application): void {
  app.get('/', (req, res) => {
    return res.status(200).send(WELCOME_MESSAGE);
  });

}
