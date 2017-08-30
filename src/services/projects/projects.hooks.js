const {authenticate} = require('feathers-authentication').hooks;

const {restrictToOwner, associateCurrentUser}
  = require('feathers-authentication-hooks');


const updateRestrictions = [
  authenticate('jwt'),
  restrictToOwner({
    idField: 'username',
    ownerField: 'creator'
  })
];


module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate('jwt'), associateCurrentUser({
      idField: 'username',
      as: 'creator'
    })],
    update: [...updateRestrictions],
    patch: [...updateRestrictions],
    remove: [...updateRestrictions]
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
