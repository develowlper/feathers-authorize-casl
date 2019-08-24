const { AbilityBuilder } = require('@casl/ability');

const casl = {
  getAllowedRules: () => {
    const { rules, can, cannot } = AbilityBuilder.extract();
    can('read', 'all');
    return rules;
  },
  getForbiddenRules: () => {
    const { rules, can, cannot } = AbilityBuilder.extract();
    cannot('read', 'all');
    return rules;
  },
};

module.exports = {
  casl,
};
