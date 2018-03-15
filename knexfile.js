'use strict';


module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/noteful-app',
    debug: true, // http://knexjs.org/#Installation-debug
    pool: {min : 0 , max : 1}
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
