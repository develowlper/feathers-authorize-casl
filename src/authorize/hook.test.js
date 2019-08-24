const feathers = require('@feathersjs/feathers');

const authorize = require('.');

const {
  casl: { getAllowedRules },
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
  beforeAll(() => {
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
});
