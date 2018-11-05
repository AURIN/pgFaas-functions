'use strict'
const {Client} = require('pg');
var options = {};

const executeQuery = (sql, params, callback) => {
    const client = new Client(options);

    if (options.host == undefined ||
      options.port == undefined ||
      options.database == undefined ||
      options.schema == undefined ||
      options.user == undefined ||
      options.password == undefined) {
      return callback({message: 'missing parameter'}, null);
    }
    client.connect();
    client.query(sql, params, (err, result) => {
      client.end();
      return callback(err, result);
    });
  }
;

module.exports = {
  init: (optionsIn) => {
    options = optionsIn;
  },
  query: (sql, params, callback) => {
    return executeQuery(sql, params, callback);
  },
  tables:
    (schema, callback) => {
      return executeQuery('SELECT * FROM pg_catalog.pg_tables WHERE schemaname = $1',
        [schema], callback);
    },
  columns:
    (schema, table, callback) => {
      return executeQuery('SELECT * FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2',
        [schema, table], callback);
    }
};

