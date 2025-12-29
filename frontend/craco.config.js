// craco.config.js
const path = require("path");
require("dotenv").config();

// Check if we're in development/preview mode (not production build)
// Craco sets NODE_ENV=development for start, NODE_ENV=production for build
const isDevServer = process.env.NODE_ENV !== "production";
const isProduction = process.env.NODE_ENV === "production";

// Environment variable overrides
const config = {
  enableHealthCheck: process.env.ENABLE_HEALTH_CHECK === "true",
  enableVisualEdits: isDevServer, // Only enable during dev server
};

// Conditionally load visual edits modules only in dev mode
let setupDevServer;
let babelMetadataPlugin;

if (config.enableVisualEdits) {
  setupDevServer = require("./plugins/visual-edits/dev-server-setup");
  babelMetadataPlugin = require("./plugins/visual-edits/babel-metadata-plugin");
}

// Conditionally load health check modules only if enabled
let WebpackHealthPlugin;
let setupHealthEndpoints;
let healthPluginInstance;

if (config.enableHealthCheck) {
  WebpackHealthPlugin = require("./plugins/health-check/webpack-health-plugin");
  setupHealthEndpoints = require("./plugins/health-check/health-endpoints");
  healthPluginInstance = new WebpackHealthPlugin();
}

const webpackConfig = {
  eslint: {
    enable: !isProduction, // Disable ESLint during production build
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      // Fix for openapi-fetch default export issue in @metamask/sdk-analytics
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        fallback: {
          ...webpackConfig.resolve?.fallback,
        },
      };

      // Disable source-map-loader warnings for node_modules
      // These warnings come from @dynamic-labs, @turnkey, @metamask packages
      webpackConfig.ignoreWarnings = [
        /Failed to parse source map/,
        /Module Warning.*source-map-loader/,
        /Critical dependency/,
        /@turnkey/,
        /@dynamic-labs/,
        /@metamask/,
      ];

      // Disable source-map-loader for problematic packages
      webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
        if (rule.enforce === 'pre' && rule.use && Array.isArray(rule.use)) {
          const sourceMapLoader = rule.use.find(
            (use) => use.loader && use.loader.includes('source-map-loader')
          );
          if (sourceMapLoader) {
            rule.exclude = [
              /node_modules\/@dynamic-labs/,
              /node_modules\/@turnkey/,
              /node_modules\/@metamask/,
              /node_modules\/@walletconnect/,
              /node_modules\/viem/,
            ];
          }
        }
        return rule;
      });

      // Production optimizations
      if (isProduction) {
        // Minimize bundle size
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          minimize: true,
          splitChunks: {
            chunks: 'all',
            maxInitialRequests: 25,
            minSize: 20000,
            cacheGroups: {
              // Vendor chunks
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name(module) {
                  const packageName = module.context.match(
                    /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                  )[1];
                  return `vendor.${packageName.replace('@', '')}`;
                },
                priority: 10,
              },
              // Dynamic Labs SDK chunk
              dynamicLabs: {
                test: /[\\/]node_modules[\\/]@dynamic-labs[\\/]/,
                name: 'vendor.dynamic-labs',
                chunks: 'all',
                priority: 20,
              },
              // Common components
              common: {
                minChunks: 2,
                priority: 5,
                reuseExistingChunk: true,
              },
            },
          },
        };

        // Remove source maps in production for smaller bundle
        webpackConfig.devtool = false;
      }

      // Add ignored patterns to reduce watched directories
      webpackConfig.watchOptions = {
        ...webpackConfig.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/build/**',
          '**/dist/**',
          '**/coverage/**',
          '**/public/**',
        ],
      };

      // Add health check plugin to webpack if enabled
      if (config.enableHealthCheck && healthPluginInstance) {
        webpackConfig.plugins.push(healthPluginInstance);
      }
      return webpackConfig;
    },
  },
};

// Only add babel metadata plugin during dev server
if (config.enableVisualEdits && babelMetadataPlugin) {
  webpackConfig.babel = {
    plugins: [babelMetadataPlugin],
  };
}

webpackConfig.devServer = (devServerConfig) => {
  // Apply visual edits dev server setup only if enabled
  if (config.enableVisualEdits && setupDevServer) {
    devServerConfig = setupDevServer(devServerConfig);
  }

  // Add health check endpoints if enabled
  if (config.enableHealthCheck && setupHealthEndpoints && healthPluginInstance) {
    const originalSetupMiddlewares = devServerConfig.setupMiddlewares;

    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      // Call original setup if exists
      if (originalSetupMiddlewares) {
        middlewares = originalSetupMiddlewares(middlewares, devServer);
      }

      // Setup health endpoints
      setupHealthEndpoints(devServer, healthPluginInstance);

      return middlewares;
    };
  }

  return devServerConfig;
};

module.exports = webpackConfig;
