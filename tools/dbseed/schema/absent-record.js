const BaseTable = require('./base-table');

class AbsentRecordTable extends BaseTable {
  constructor() {
    super('absent_record', ['arid', 'start_date', 'end_date', 'name', 'description'], []);
  }

  generateMockData() {
    const absent = [...require('../absent.json')];
    for (let i = 0; i < absent.length; i++) {
      super.putData(absent[i])
    }
  }
}

module.exports = AbsentRecordTable;
