const Chance = require('chance');
const BaseTable = require('./base-table');
const moment = require('moment');

const chance = new Chance();

class ActivityTable extends BaseTable {
  constructor() {
    super('activity', ['aid', 'name', 'start_date', 'duration'], []);
  }

  generateMockData() {
    const activityNumber = 376;
    for (let i = 0; i < activityNumber; i++) {
      const year = chance.integer({ min: 56, max: 59 });
      super.putData({
        aid: i + 1,
        name: chance.sentence({ words: chance.integer({ min: 3, max: 6 }) }),
        start_date: moment(chance.date({ year: 1957 + year })).add(8, 'months').toDate(),
        duration: chance.integer({ min: 3, max: 60 })
      })
    }
  }
}

module.exports = ActivityTable;

