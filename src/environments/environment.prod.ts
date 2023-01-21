// `.env.ts` is generated by the `npm run env` command
// `npm run env` exposes environment variables as JSON for any usage you might
// want, like displaying the version or getting extra config from your CI bot, etc.
// This is useful for granularity you might need beyond just the environment.
// Note that as usual, any environment variables you expose through it will end up in your
// bundle, and you should not use it for any sensitive information like passwords or keys.

export const environment = {
  production: true,
  version: "1.0.0",
  serverUrl: 'https://api-gaceta.datalis.dev/api',
  newsApiUrl: 'https://api.eltoque.com/posts?categories=600c46c1929b80000d284502&_sort=publish_date:DESC&_limit=10',
  elToqueApi: 'https://api.eltoque.com',
  defaultLanguage: 'en-CU',
  supportedLanguages: ['en-US', 'es-CU'],
};
