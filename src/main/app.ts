import * as path from 'path';

import { Logger } from '@hmcts/nodejs-logging';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import { glob } from 'glob';

import { setupDev } from './development';
import { AppInsights } from './modules/appinsights';
import { Helmet } from './modules/helmet';
import { PropertiesVolume } from './modules/properties-volume';

const env = process.env.NODE_ENV || 'development';
const developmentMode = env === 'development';
export const app = express();
app.locals.ENV = env;
const logger = Logger.getLogger('app');

new PropertiesVolume().enableFor(app);
new Helmet().enableFor(app);
new AppInsights().enable();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
  next();
});

(async () => {
  const files = glob.sync(path.join(__dirname, '/routes/**/*.+(ts|js)'));

  for (const filename of files) {
    const route = await import(filename);
    route.default(app);
  }
})();

setupDev(app, developmentMode);
// returning "not found" page for requests with paths not resolved by the router
app.use((req, res) => {
  res.status(404);
});

// error handler
// error handler
app.use((err: Error & { status?: number }, req: express.Request, res: express.Response) => {
  logger.error(`${err.stack || err}`);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = env === 'development' ? err : {};

  res.status(err.status || 500).send('Something went wrong');
});
