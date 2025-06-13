const fs = require('fs');
const path = require('path');

let dbm;
let type;
let seed;
let Promise;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
};

exports.up = function(db) {
  const filePath = path.join(__dirname, 'sqls', '20250314223401-trips-table-up.sql');

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return reject(err);
      }
      console.log('Received data:', data);
      resolve(data);
    });
  }).then(data => db.runSql(data));
};

exports.down = function(db) {
  const filePath = path.join(__dirname, 'sqls', '20250314223401-trips-table-down.sql');

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return reject(err);
      }
      console.log('Received data:', data);
      resolve(data);
    });
  }).then(data => db.runSql(data));
};

exports._meta = {
  version: 1
};
