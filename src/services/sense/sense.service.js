// Initializes the `sense` service on path `/sense`
const createService = require('feathers-nedb');
const createModel = require('../../models/sense.model');
const hooks = require('./sense.hooks');
const filters = require('./sense.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'sense',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/sense', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('sense');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
