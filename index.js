const config = require('./config');
const app = require('./app');

app.listen(config.web.port, config.web.hostName, err => {
  if (err) {
    throw err;
  }
  console.log(`Listening on ${config.web.hostName}:${config.web.port}`);
});
