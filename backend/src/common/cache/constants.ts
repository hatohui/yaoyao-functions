export const CacheSettings = {
  food: {
    all: {
      key: (lang: string, page: number, count: number, categoryId: string) =>
        `foods:${lang}:${page}:${count}:${categoryId}`,
      ttl: 1800,
    },
    popular: {
      key: "foods:popular",
      ttl: 300,
    },
  },
  categories: {
    all: {
      key: (lang: string) => `categories:all:${lang}`,
      ttl: 3600,
    },
    one: {
      key: (id: string, lang: string) => `categories:${id}:${lang}`,
      ttl: 3600,
    },
  },
  languages: {
    all: {
      key: "languages:all",
      ttl: 3600,
    },
    codes: {
      key: "languages:codes",
      ttl: 3600,
    },
  },
  event: {
    active: {
      key: "event:active",
      ttl: 1800,
    },
  },
  config: {
    all: {
      key: "config:all",
      ttl: 1800,
    },
  },
};
