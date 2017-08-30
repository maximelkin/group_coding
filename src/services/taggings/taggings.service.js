// Initializes the `taggings` service on path `/taggings`
const createService = require('feathers-sequelize');
const createModel = require('../../models/taggings.model');
const hooks = require('./taggings.hooks');
const filters = require('./taggings.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'taggings',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/taggings', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('taggings');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
