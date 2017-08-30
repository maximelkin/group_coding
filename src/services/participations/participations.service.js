// Initializes the `participations` service on path `/participations`
const createService = require('feathers-sequelize');
const createModel = require('../../models/participations.model');
const hooks = require('./participations.hooks');
const filters = require('./participations.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'participations',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/participations', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('participations');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
