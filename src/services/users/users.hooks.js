const {authenticate} = require('feathers-authentication').hooks;
const {commonHooks} = require('feathers-hooks-common');
const {restrictToOwner} = require('feathers-authentication-hooks');
const {hashPassword} = require('feathers-authentication-local').hooks;

const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: 'username',
    ownerField: 'username'
  })
];

module.exports = {
  before: {
    all: [],
    find: [commonHooks.removeQuery('password', 'body')],
    get: [],
    create: [hashPassword()],
    update: [...restrict, hashPassword()],
    patch: [...restrict, hashPassword()],
    remove: [...restrict]
  },

  after: {
    all: [
      commonHooks.when(
        hook => hook.params.provider,
        commonHooks.discard('password')
      )
    ],
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
