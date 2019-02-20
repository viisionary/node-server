import redis from "redis";
import bluebird from 'bluebird';

bluebird.promisifyAll(redis);

export function createClient() {
  return new Promise((resolve, reject) => {
    // const { redis: { host, port, password } } = config;
    const host = '';
    const port = '';
    const client = redis.createClient({
      host,
      port,
      enable_offline_queue: false,
      password,
      retry_strategy(options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      },
    });
    client.on('error', err => {
      reject(new Error(`redis error: ${err.message}, ${err.stack}`));
    });

    client.on('connect', () => {
      console.info(`redis connected: ${host}:${port}`);
      resolve(client);
    });

    client.on('reconnecting', ({ delay: delayTime, attempt }) => {
      console.warn(
        `redis reconnecting, delay: ${delayTime}, attempt: ${attempt}`,
      );
    });

    client.on('end', () => {
      console.warn(`redis ended: ${host}:${port}`);
    });
  });
}
