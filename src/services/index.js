const sense = require('./sense/sense.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(sense);
};
