const app = require('./src/app');
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;
console.log(HOST)
app.listen(HOST);
console.log(`Running on http://${HOST}:${PORT}`);
