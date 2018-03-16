'use strict';

const knexConfig = require('./knexfile');

const environment = 'test' || 'development';

module.exports = require('knex')(knexConfig[environment]);
