const { Ability } = require('@casl/ability');
const { toMongoQuery } = require('@casl/mongoose');
const { Forbidden } = require('@feathersjs/errors');
const TYPE_KEY = Symbol.for('type');

Ability.addAlias('update', 'patch');
Ability.addAlias('read', ['get', 'find']);
Ability.addAlias('delete', 'remove');

function subjectName(subject) {
  if (!subject || typeof subject === 'string') {
    return subject;
  }

  return subject[TYPE_KEY];
}

function defineAbilitiesFor({ rules }) {
  return new Ability(rules, { subjectName });
}

const authorize = () => {
  return async context => {
    const {
      path,
      method: action,
      data: dataProp,
      params: { query: queryProp, user },
    } = context;
    const service = name ? context.app.service(name) : context.service;
    const serviceName = name || path;
    const ability = defineAbilitiesFor(user);
    const data = { ...dataProp };
    const paramsProp = { ...context.params, ability };

    const throwUnlessCan = (action, resource) => {
      if (ability.cannot(action, resource)) {
        throw new Forbidden(`You are not allowed to ${action} ${serviceName}`);
      }
    };

    if (action === 'create') {
      data[TYPE_KEY] = serviceName;
      throwUnlessCan('create', data);
      return {
        ...context,
        data,
      };
    }

    if (action === 'find') {
      const query = toMongoQuery(ability, serviceName, action);
      if (!query) {
        throw new Forbidden(`You are not allowed to ${action} ${serviceName}`);
      }
      return {
        ...context,
        query: {
          ...queryProp,
          ...query,
        },
      };
    }

    const result = await service.get(hook.id, {
      ...paramsProp,
      provider: null,
    });

    result[TYPE_KEY] = serviceName;
    throwUnlessCan(action, result);

    if (action === 'get') {
      return {
        ...context,
        result,
      };
    }

    return {
      ...context,
    };
  };
};

module.exports = authorize;
