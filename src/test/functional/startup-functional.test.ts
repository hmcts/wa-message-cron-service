import { ChildProcess, spawn } from 'child_process';
let serverProcess: ChildProcess;

beforeAll(() => {
  console.log('Starting the server process', process.env.NODE_ENV);

  const nodeConfig = {
        s2s: { secret: process.env.S2S_SECRET_CASE_EVENT_HANDLER },
        secrets: {
          wa: {
            's2s-secret-case-event-handler': process.env.S2S_SECRET_CASE_EVENT_HANDLER,
          },
        },
      };

  serverProcess = spawn('yarn', ['start'], {
      shell: true,
      stdio: 'pipe',
      env: {
        ...process.env,
        ALLOW_CONFIG_MUTATIONS: 'true',
        NODE_CONFIG: JSON.stringify(nodeConfig),
      },
    });
});

afterAll(() => {
  // Clean up the server process
  if (serverProcess) {
    serverProcess.kill('SIGINT');
  }
});

test('should verify server starts, gets S2S token, and calls CEH', async () => {
  let output = '';

  if (serverProcess.stdout) {
    serverProcess.stdout.on('data', (data: Buffer) => {
      output += data.toString();
    });
  }

  if (serverProcess.stderr) {
    serverProcess.stderr.on('data', (data: Buffer) => {
      output += data.toString();
    });
  }

  // Wait for some time to let the server start
  await new Promise(resolve => setTimeout(resolve, 30000));

  console.log('Output log', output);
  expect(output).toContain('Application started');
  expect(output).toContain('Received S2S token');
  expect(output).toContain('Status: 200');
  expect(output).toContain('Response: {"job_details":{"name":"FIND_PROBLEM_MESSAGES"}}');
}, 60000);
