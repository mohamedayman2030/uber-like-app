const fs = require('fs');
const path = require('path');

// For __dirname in CommonJS, it's already available
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
  const filePath = path.join(__dirname, 'sqls', '20250314222920-drivers-table-up.sql');
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) return reject(err);
      console.log('received data: ' + data);
      resolve(data);
    });
  }).then(data => db.runSql(data));
};

exports.down = function(db) {
  const filePath = path.join(__dirname, 'sqls', '20250314222920-drivers-table-down.sql');
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) return reject(err);
      console.log('received data: ' + data);
      resolve(data);
    });
  }).then(data => db.runSql(data));
};

exports._meta = {
  version: 1
};
