const users = require('./users/users.service.js');
const projects = require('./projects/projects.service.js');
const taggings = require('./taggings/taggings.service.js');
const participations = require('./participations/participations.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(projects);
  app.configure(taggings);
  app.configure(participations);
};
