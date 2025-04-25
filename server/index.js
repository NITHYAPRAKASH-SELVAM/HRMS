const app = require('./src/app');
const HOST = 'localhost';
const PORT = 5000;

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});

