import config from 'config';
import nock from 'nock';
import { CaseEventHandlerService } from '../../main/services/case-event-handler-service';

const s2sUrl = config.get<string>('s2s.url');
const cehUrl = config.get<string>('services.caseEventHandler.url');

describe('CaseEventHandlerService.createJob()', () => {
  const realExit = process.exit;

  beforeAll(() => {
    process.exit = jest.fn(() => { throw 'mockExit'; });
  });

  afterEach(() => {
    nock.cleanAll();
    jest.restoreAllMocks();
  });

  afterAll(() => {

    process.exit = realExit;
  });

  it('exits when S2S request fails', async () => {

    nock(s2sUrl).post('/lease').replyWithError('Network failure');

    const svc = new CaseEventHandlerService();
    await expect(svc.createJob()).rejects.toEqual('mockExit');
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('exits when CEH job creation fails', async () => {

    nock(s2sUrl).post('/lease').reply(200, 'dummy-s2s-token');

    nock(cehUrl).post(new RegExp('/messages/jobs/.*')).replyWithError('CEH failure');

    const svc = new CaseEventHandlerService();
    await expect(svc.createJob()).rejects.toEqual('mockExit');
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('resolves when both calls succeed', async () => {

    nock(s2sUrl).post('/lease').reply(200, 'dummy-s2s-token');

    nock(cehUrl).post(new RegExp('/messages/jobs/.*')).reply(201, {});

    const svc = new CaseEventHandlerService();
    await expect(svc.createJob()).resolves.toBeUndefined();
  });
});
