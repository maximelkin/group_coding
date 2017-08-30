const {authenticate} = require('feathers-authentication').hooks;
const {restrictToOwner, some} = require('feathers-authentication-hooks');
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
    get: [],
    create: [authenticate('jwt'), isProjectCreator],
    //checks if is project creator or this participation about him
    remove: [authenticate('jwt'), some(restrictToOwner({
      idField: 'username',
      ownerField: 'username'
    }, isProjectCreator))]
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
