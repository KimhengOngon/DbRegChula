const db = require('./db');

/**
 * Calls db.query and return as a Promise.
 * 
 * @param {string} queryString query string
 * @param {any[]} queryParams array of query params
 * @returns {Promise<{rows: any[], fields: any[]}>} a Promise that will resolve with query result object.
 */
exports.queryAsPromise = function (queryString, queryParams) {
  return new Promise((resolve, reject) => {
    db.query(queryString, queryParams || [], (err, rows, fields) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ rows, fields });
    });
  });
};
