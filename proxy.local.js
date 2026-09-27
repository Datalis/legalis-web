// Proxy de `yarn start:local`: la API de elTOQUE se pide desde Node, así que no
// hay CORS ni reto de Cloudflare para localhost. Hace falta un Strapi con la ruta
// /api/feed/posts (rama develop de eltoque3.0 o superior).
//   ELTOQUE_API_URL    destino (por defecto el Strapi local en 127.0.0.1:1338)
//   ELTOQUE_API_TOKEN  token de Strapi (opcional; el feed es público)
const target = process.env.ELTOQUE_API_URL || 'http://127.0.0.1:1338';
const token = process.env.ELTOQUE_API_TOKEN;

module.exports = {
  '/eltoque-api': {
    target,
    changeOrigin: true,
    secure: true,
    pathRewrite: { '^/eltoque-api': '' },
    headers: {
      'x-application': '1',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    logLevel: 'info',
  },
};
