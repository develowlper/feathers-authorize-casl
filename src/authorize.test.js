const feathers = require('@feathersjs/feathers');

const authorize = require('./authorize');

const addUserHook = () => {
  console.log('INIT');
  return async context => {
    return {
      ...context,
      params: {
        user: {
          rules: {},
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
        return {
          ...params.user,
        };
      },
    });
    app.service('/').hooks({
      before: {
        all: [addUserHook(), authorize()],
      },
    });
  });

  test('it should return ok', async () => {
    const res = await app.service('/').find({
      query: {
        $limit: 20,
      },
    });
    console.log(res);
  });
});
