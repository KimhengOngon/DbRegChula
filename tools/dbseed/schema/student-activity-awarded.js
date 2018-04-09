const BaseTable = require('./base-table');
const chance = require('chance')();

class StudentActivityAwardedTable extends BaseTable {
  constructor() {
    super('student_activity_awarded', ['sid', 'aid', 'award'], ['activity', 'student', 'student_activity_join']);
  }

  generateMockData() {
    const studentActivityData = super.getDepTable('student_activity_join').getData();
    for (const studentActivity of studentActivityData) {
      let awardName;
      const r = Math.random();
      if (r < 0.1) {
        awardName = 'Gold medal in ';
      } else if (r < 0.3) {
        awardName = 'Silver medal in ';
      } else if (r < 0.6) {
        awardName = 'Bronze medal in ';
      } else if (r < 0.65) {
        awardName = 'Certificate for ';
      }

      if (awardName) {
        awardName += chance.sentence({ words: chance.integer({ min: 3, max: 6 }) }).toLocaleLowerCase();
        super.putData({
          sid: studentActivity.sid,
          aid: studentActivity.aid,
          award: awardName
        });
      }
    }
  }
}

module.exports = StudentActivityAwardedTable;

