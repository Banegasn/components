import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';

const workspaceName = path.basename(process.cwd());
const browserChannel = process.env.WTR_BROWSER_CHANNEL;
const configDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspacePort =
  8100 +
  [...workspaceName].reduce(
    (value, character) => value + character.charCodeAt(0),
    0,
  );

export default {
  port: workspacePort,
  nodeResolve: true,
  browsers: [
    playwrightLauncher({
      product: 'chromium',
      launchOptions: browserChannel ? { channel: browserChannel } : undefined,
    }),
  ],
  plugins: [
    esbuildPlugin({
      ts: true,
      tsconfig: path.join(configDirectory, 'tsconfig.web-test.json'),
      target: 'es2022',
    }),
  ],
};
