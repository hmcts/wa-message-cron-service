#!/usr/bin/env node
import * as https from 'https';

import { Logger } from '@hmcts/nodejs-logging';

import { app } from './app';
import { CaseEventHandlerService } from './services/case-event-handler-service';
import { exit } from './utils/exit';

const logger = Logger.getLogger('server');

const port: number = parseInt(process.env.PORT!, 10) || 9988;

if (app.locals.ENV === 'development') {
  const sslOptions = {};
  const server = https.createServer(sslOptions, app);
  server.listen(port, () => {
    logger.info(`Application started: https://localhost:${port}`);
  });
} else {
  app.listen(port, () => {
    logger.info(`Application started: http://localhost:${port}`);
  });
}

new CaseEventHandlerService().createJob().then(() => exit(0));
