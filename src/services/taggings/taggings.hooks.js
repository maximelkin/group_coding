const {authenticate} = require('feathers-authentication').hooks;
const errors = require('feathers-errors');

const isProjectCreator = (hook) => {
  return hook.app('projects')
    .get(hook.data.projectId)
    .then(project => {
      const username = hook.params.user.username;
      if (project.creator !== username) {
        throw new errors.Forbidden('not creator of project');
      }
    });
};


module.exports = {
  before: {
    all: [],
    find: [],
    create: [authenticate('jwt'), isProjectCreator],
    remove: [authenticate('jwt'), isProjectCreator]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
