import redis from 'redis';

const client = redis.createClient({
  host: process.env.REDIS_HOST
});

export const redisPromise = {
  get: (key) => new Promise((resolve, reject) =>
    client.get(key, (err, res) => err ? reject(err) : resolve(res)))
}

export default client;