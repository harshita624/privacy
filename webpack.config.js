const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add fallbacks for missing Node.js modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    vm: require.resolve('vm-browserify'),
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('crypto-browserify'),
  };

  return config;
};
