import Redis from "ioredis";

let _client: Redis | null = null;
let _isAvailable = false;
const _fallbackCache = new Map<string, { value: unknown; expiresAt: number }>();

async function initializeClient(): Promise<Redis | null> {
  if (_client !== null) return _isAvailable ? _client : null;

  const url = process.env.REDIS_URL;
  if (!url) {
    console.warn("[Redis] REDIS_URL not set, using fallback cache");
    return null;
  }

  try {
    const client = new Redis(url);
    client.on("error", (err: Error) => {
      console.warn("[Redis] Connection error:", err.message);
      _isAvailable = false;
    });

    await client.ping();
    _isAvailable = true;
    _client = client;
    console.log("[Redis] Connected successfully");
    return client;
  } catch (err) {
    console.warn(
      "[Redis] Failed to connect:",
      err instanceof Error ? err.message : String(err)
    );
    _isAvailable = false;
    return null;
  }
}

function getFallbackCache<T>(key: string): T | null {
  const cached = _fallbackCache.get(key);
  if (!cached) return null;
  if (cached.expiresAt < Date.now()) {
    _fallbackCache.delete(key);
    return null;
  }
  return cached.value as T;
}

function setFallbackCache(key: string, value: unknown, ttl?: number): void {
  _fallbackCache.set(key, {
    value,
    expiresAt: ttl ? Date.now() + ttl * 1000 : Infinity,
  });
}

export const CacheService = {
  async get<T>(key: string): Promise<T | null> {
    await initializeClient();

    if (_client && _isAvailable) {
      try {
        const result = await _client.get(key);
        return result ? JSON.parse(result) : null;
      } catch (err) {
        console.warn("[Redis] Get operation failed:", err instanceof Error ? err.message : String(err));
        return getFallbackCache<T>(key);
      }
    }

    return getFallbackCache<T>(key);
  },

  async set(key: string, value: unknown, ttl?: number): Promise<string | null> {
    await initializeClient();

    if (_client && _isAvailable) {
      try {
        return ttl
          ? await _client.set(key, JSON.stringify(value), "EX", ttl)
          : await _client.set(key, JSON.stringify(value));
      } catch (err) {
        console.warn("[Redis] Set operation failed:", err instanceof Error ? err.message : String(err));
        setFallbackCache(key, value, ttl);
        return null;
      }
    }

    setFallbackCache(key, value, ttl);
    return null;
  },

  async delete(key: string): Promise<void> {
    await initializeClient();

    if (_client && _isAvailable) {
      try {
        await _client.del(key);
      } catch (err) {
        console.warn("[Redis] Delete operation failed:", err instanceof Error ? err.message : String(err));
      }
    }

    _fallbackCache.delete(key);
  },

  async ping(): Promise<string> {
    await initializeClient();

    if (_client && _isAvailable) {
      try {
        return await _client.ping();
      } catch (err) {
        console.warn("[Redis] Ping operation failed:", err instanceof Error ? err.message : String(err));
        return "FALLBACK";
      }
    }

    return "FALLBACK";
  },

  isAvailable(): boolean {
    return _isAvailable;
  },
};
