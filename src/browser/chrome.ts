
import * as os from 'os';
import * as path from 'path';
import * as cp from 'child_process';
import * as P from 'bluebird';

const CHROME_PATH = path.resolve(process.env.CHROME_PATH);

const flags = [
  '--headless',
  '--disable-gpu',
  '--remote-debugging-port=9222',
  '--hide-scrollbars',
  '--enable-logging',
  '--log-level=0',
  '--v=99',
  '--single-process',
  '--window-size=1280x1696',
  '--no-sandbox',
  '--user-data-dir=/tmp/user-data',
  '--data-path=/tmp/data-path',
  '--ignore-certificate-errors',
  '--homedir=/tmp',
  '--disk-cache-dir=/tmp/cache-dir',
];

// chrome-canary --headless --disable-gpu --remote-debugging-port=9222 --hide-scrollbars --enable-logging --log-level=0 --v=99 --single-process
export default function spawn() {
  const chrome = cp.spawn(
    CHROME_PATH,
    flags,
    {
      cwd: os.tmpdir(),
      shell: true,
      detached: true,
      stdio: 'ignore',
    },
  );

  chrome.unref();

  return P.delay(15000);
}
