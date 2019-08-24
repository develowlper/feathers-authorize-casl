const feathers = require('@feathersjs/feathers');
const { Forbidden } = require('@feathersjs/errors');

const authorize = require('.');

const {
  casl: { getAllowedRules, getForbiddenRules },
} = require('./authorize.fixtures');

const addUserHook = rules => {
  return async context => {
    return {
      ...context,
      params: {
        user: {
          rules,
        },
      },
    };
  };
};

describe("'authorize' hook", () => {
  let app;
  beforeEach(() => {
    app = feathers();
    app.use('/', {
      find: async params => {
        return 'OK';
      },
    });
  });

  test('it should return OK', async () => {
    app.service('/').hooks({
      before: {
        all: [addUserHook(getAllowedRules()), authorize()],
      },
    });
    const res = await app.service('/').find();
    expect(res).toBe('OK');
  });

  test('it should return 403', async () => {
    app.service('/').hooks({
      before: {
        all: [addUserHook(getForbiddenRules()), authorize()],
      },
    });

    expect(app.service('/').find).toThrow(Forbidden);
  });
});
