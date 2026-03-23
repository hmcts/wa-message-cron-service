import { infoRequestHandler } from '@hmcts/info-provider';
import { Router } from 'express';

export default function (app: Router): void {
  app.get(
    '/info',
    infoRequestHandler({
      extraBuildInfo: {
        name: 'expressjs-template'
      },
      info: {
        // TODO: add downstream info endpoints if your app has any
      },
    })
  );
}
