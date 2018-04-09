const BaseTable = require('./base-table');

class UserTable extends BaseTable {
  constructor() {
    super('user', ['id', 'password', 'display_name', 'type'], []);
  }

  generateMockData() {
    super.putData({
      id: 'advisor',
      password: 'test',
      display_name: 'Advisor Test Account',
      type: 'A'
    });
    super.putData({
      id: 'manager',
      password: 'test',
      display_name: 'Manager Test Account',
      type: 'M'
    });
  }
}

module.exports = UserTable;

