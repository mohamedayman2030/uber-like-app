const fs = require('fs');
const path = require('path');

let dbm;
let type;
let seed;
let Promise;

/**
 * Receives the db-migrate dependency from db-migrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
};

/**
 * Runs the migration "up".
 */
exports.up = function(db) {
  const filePath = path.join(__dirname, 'sqls', '20250310013653-Riders-table-up.sql');

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        console.error('Error reading migration file:', err);
        return reject(err);
      }
      console.log('Executing SQL:', data);
      resolve(data);
    });
  }).then(data => db.runSql(data));
};

/**
 * Runs the migration "down".
 */
exports.down = function(db) {
  const filePath = path.join(__dirname, 'sqls', '20250310013653-Riders-table-down.sql');

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        console.error('Error reading rollback file:', err);
        return reject(err);
      }
      console.log('Rolling back SQL:', data);
      resolve(data);
    });
  }).then(data => db.runSql(data));
};

exports._meta = {
  version: 1
};
