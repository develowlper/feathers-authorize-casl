const authorize = () => {
  return async context => {
    console.log(context);
    return context;
  };
};

module.exports = authorize;
