/* eslint key-spacing:0 spaced-comment:0 */
const path = require('path');
const debug = require('debug')('app:config:project');
const argv = require('yargs').argv;
// const ip = require('ip');

debug('Creating default configuration.');
// ========================================================
// Default Configuration
// ========================================================
const config = {
  env : process.env.NODE_ENV || 'development',

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base  : path.resolve(__dirname, '..'),
  dir_client : 'src',
  dir_dist   : 'dist',
  dir_public : 'public',
  dir_server : 'server',
  dir_test   : 'src/test',
  dir_static : 'src/static',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host : 'localhost', // ip.address(), // use string 'localhost' to prevent exposure on local network
  server_port : process.env.PORT || 3000,

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_devtool         : 'source-map',
  compiler_hash_type       : 'hash',
  compiler_stats           : {
    chunks : false,
    chunkModules : false,
    colors : true
  },
  compiler_vendors : [
    'react',
    'react-redux',
    'react-router',
    'redux',
    'axios',
    'babel-polyfill',
    'bootstrap',
    'deep-diff',
    'element-resize-event',
    'es6-enum',
    'eslint-plugin-standard',
    // 'extract-text-webpack-plugin',
    // 'fs-extra',
    // 'html-webpack-plugin',
    'ip',
    'jquery',
    'lodash.clonedeep',
    'lodash.isempty',
    'lodash.omit',
    'moment',
    'moment-timezone',
    'rc-slider',
    'react-addons-css-transition-group',
    'react-addons-transition-group',
    'react-bootstrap-typeahead',
    'react-copy-to-clipboard',
    'react-dom',
    'react-fa',
    'react-json-edit',
    'react-json-tree',
    'react-moment',
    'react-switch-button',
    'reactable',
    'reactstrap',
    'reapop',
    'reapop-theme-wybo',
    'recharts',
    'redux-actions',
    'redux-thunk',
    'uuid',
    'validator'

  ]
};

/************************************************
-------------------------------------------------

All Internal Configuration Below
Edit at Your Own Risk

-------------------------------------------------
************************************************/

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
  'process.env'  : {
    'NODE_ENV' : JSON.stringify(config.env)
  },
  'NODE_ENV'     : config.env,
  '__DEV__'      : config.env === 'development',
  '__PROD__'     : config.env === 'production',
  '__COVERAGE__' : !argv.watch && config.env === 'test',
  '__BASENAME__' : JSON.stringify(process.env.BASENAME || '')
};

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('../package.json');

config.compiler_vendors = config.compiler_vendors
  .filter((dep) => {
    if (pkg.dependencies[dep]) return true;

    debug(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.
       Consider removing it from \`compiler_vendors\` in ~/config/index.js`
    );
  });

// ------------------------------------
// Utilities
// ------------------------------------
function base () {
  const args = [config.path_base].concat([].slice.call(arguments));
  return path.resolve.apply(path, args);
}

config.paths = {
  base   : base,
  client : base.bind(null, config.dir_client),
  public : base.bind(null, config.dir_public),
  dist   : base.bind(null, config.dir_dist),
  static : base.bind(null, config.dir_static)
};

// ========================================================
// Environment Configuration
// ========================================================
debug(`Looking for environment overrides for NODE_ENV "${config.env}".`);
const environments = require('./environments.config');
const overrides = environments[config.env];
if (overrides) {
  debug('Found overrides, applying to default configuration.');
  Object.assign(config, overrides(config));
} else {
  debug('No environment overrides found, defaults will be used.');
}

module.exports = config;
