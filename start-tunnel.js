import ngrok from '@ngrok/ngrok';
import { spawn } from 'child_process';

const PORT = process.env.PORT || 10000;
const NGROK_AUTHTOKEN = process.env.NGROK_AUTHTOKEN;
const NGROK_DOMAIN = process.env.NGROK_DOMAIN;

async function start() {
  // Launch omliteroute via its native start script
  const app = spawn('npm', ['run', 'start'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: String(PORT) }
  });

  // Start the ngrok tunnel if token is supplied
  if (NGROK_AUTHTOKEN) {
    try {
      const session = await ngrok.connect({
        addr: Number(PORT),
        authtoken: NGROK_AUTHTOKEN,
        domain: NGROK_DOMAIN || undefined
      });
      console.log(`==============================================`);
      console.log(`[ngrok] Public tunnel active at: ${session.url()}`);
      console.log(`==============================================`);
    } catch (err) {
      console.error('[ngrok] Failed to establish tunnel:', err.message);
    }
  } else {
    console.warn('[ngrok] NGROK_AUTHTOKEN not set. Exposing via Render URL only.');
  }

  app.on('exit', (code) => process.exit(code || 0));
}

start();