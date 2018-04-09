/**
 * Edit the content in this file and save as `config.js` in the same location.
 * Remember not to accidentally expose your own password!
 */

module.exports = {
  web: {
    hostName: 'localhost',
    port: '3000',
  },
  db: {
    hostName: 'localhost',
    port: 3306,
    username: 'your_db_username_here',
    password: 'your_db_password_here',
    databaseName: 'your_db_name_here'
  }
};
