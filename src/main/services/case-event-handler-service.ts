import axios, { AxiosInstance } from 'axios';
import config from 'config';

import { JobName } from '../model/job-names';
import { exit } from '../utils/exit';
import Logger, { getLogLabel } from '../utils/logger';

import S2SService from './s2s-service';

const BASE_URL: string = config.get('services.caseEventHandler.url');
const logger: Logger = new Logger();
const logLabel: string = getLogLabel(__filename);
const s2sService: S2SService = S2SService.getInstance();

const caseEventHandlerApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class CaseEventHandlerService {
  public async createJob(): Promise<void> {
    const jobName: string = config.get('job.name');
    const JOB_NAME: JobName = JobName[jobName as keyof typeof JobName];
    logger.trace(`Attempting to create a job for task ${JOB_NAME}`, logLabel);
    return this.createTaskJob(JobName[JOB_NAME]);
  }

  private createTaskJob(job: JobName): Promise<void> {
    return s2sService.getServiceToken().then(s2sToken => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const headers: any = { ServiceAuthorization: s2sToken };
      const data = {};
      return caseEventHandlerApi
        .post('/messages/jobs/' + job, data, { headers })
        .then(resp => {
          logger.trace(`Status: ${resp.status}`, logLabel);
          logger.trace(`Response: ${JSON.stringify(resp.data)}`, logLabel);
        })
        .catch(err => {
          logger.exception(err, logLabel);
          exit(1);
        });
    });
  }
}
