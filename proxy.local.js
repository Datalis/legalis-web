// Proxy de `yarn start:local`: la API de elTOQUE se pide desde Node, así que no
// hay CORS ni preflight que Cloudflare bloquee, y el token no llega al bundle.
//   ELTOQUE_API_URL    destino (por defecto el Strapi local en 127.0.0.1:1338)
//   ELTOQUE_API_TOKEN  token de lectura de Strapi (opcional)
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
