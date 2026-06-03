import Redis from "ioredis";

let _client: Redis | null = null;

function getClient(): Redis {
  if (!_client) {
    const url = process.env.REDIS_URL;
    if (!url) throw new Error("REDIS_URL is not set");
    _client = new Redis(url);
    _client.on("error", (err: Error) => {
      console.error("[Redis]", err.message);
    });
  }
  return _client;
}

export const CacheService = {
  async get<T>(key: string): Promise<T | null> {
    const result = await getClient().get(key);
    return result ? JSON.parse(result) : null;
  },

  async set(key: string, value: unknown, ttl?: number): Promise<string | null> {
    return ttl
      ? getClient().set(key, JSON.stringify(value), "EX", ttl)
      : getClient().set(key, JSON.stringify(value));
  },

  async delete(key: string): Promise<void> {
    await getClient().del(key);
  },

  async ping(): Promise<string> {
    return getClient().ping();
  },
};
