const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = async function (env, argv) {
  // Create the default Expo webpack config
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['@react-navigation'],
      },
    },
    argv
  );

  // Add the BundleAnalyzerPlugin only if `argv.mode` is defined and it's 'production'
  if (argv && argv.mode === 'production') {
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
};

