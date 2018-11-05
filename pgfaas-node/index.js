'use strict';

const express = require('express');
const app = express();
const _ = require('underscore');
const program = require('commander');
const sqlexec = require('./sqlexec.js');
const pack = require('./package.json');

program
  .version(pack.version)
  .option('--host <s>')
  .option('--port <s>')
  .option('--database <s>')
  .option('--schema <s>')
  .option('--user <s>')
  .option('--password <s>')
  .option('--script <s>')
  .parse(process.argv);

const script = require('require-from-string')(program.script || process.env.SCRIPT);

sqlexec.init({
  host: program.host || process.env.PGHOST,
  port: program.port || process.env.PGPORT,
  database: program.database || process.env.PGDATABASE,
  schema: program.schema || process.env.PGSCHEMA,
  user: program.user || process.env.PGUSER,
  password: program.password || process.env.PGPASSWORD
});

/**
 * Sets CORS headers
 * @param response Object
 */
const headers = (res) => {
  res.set({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  return res;
};

app.use(express.urlencoded({extended: true}));
app.use(express.json());

/**
 * Returns a list of tables
 */
app.get('/tables', (req, res) => {
  try {
    sqlexec.tables(program.schema, (err, resTables) => {
      if (err) {
        headers(res).status(500).json(err);
      } else {
        headers(res).status(200).json(resTables);
      }
    });
  } catch (err) {
    headers(res).status(500).json({message: err.message, stack: err.stack});
  }
});

/**
 * Returns description of a table
 */
app.get('/tables/:tableName', (req, res) => {
  try {
    sqlexec.columns(program.schema, req.params.tableName, (err, resDescr) => {
      if (err) {
        headers(res).status(500).json(err);
      } else {
        headers(res).status(200).json(resDescr);
      }
    });
  } catch (err) {
    headers(res).status(500).json({message: err.message, stack: err.stack});
  }
});

/**
 * Execute the function script
 */
app.post('/', (req, res) => {
  try {
    script[req.body.verb](sqlexec, req, (err, result) => {
      if (err) {
        headers(res).status(500).json(err);
      } else {
        headers(res).status(200).json(result);
      }
    });
  } catch (err) {
    headers(res).status(500).json({message: err.message, stack: err.stack});
  }
});

app.listen(3000, () => {
  console.log(`pgFaas Node.js ${pack.version} listening on port: 3000`)
});
