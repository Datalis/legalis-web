function requireHttps(req, res, next) {
  if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

const express = require('express');
const app = express();
app.use(requireHttps);

app.use(express.static('./dist/'));

app.get('/*', function (req, res) {
  res.sendFile('index.html', { root: 'dist/' });
});

app.listen(process.env.PORT || 8080);
