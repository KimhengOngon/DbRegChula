const BaseTable = require('./base-table');
const chance = require('chance')();

class StudentActivityJoinTable extends BaseTable {
  constructor() {
    super('student_activity_join', ['sid', 'aid'], ['activity', 'student']);
  }

  generateMockData() {
    const activityData = super.getDepTable('activity').getData();
    const studentData = super.getDepTable('student').getData();
    for (const activity of activityData) {
      const noOfStudentWithThisAward = chance.integer({ min: 1, max: 5 });
      const studentsThatCanHaveThisAward = studentData.filter(
        student => new Date(student.ent_year, 7, 15) < activity.start_date
      );
      const studentsWithThisAward = chance.shuffle(studentsThatCanHaveThisAward).slice(0, noOfStudentWithThisAward);
      for (const student of studentsWithThisAward) {
        super.putData({
          sid: student.sid,
          aid: activity.aid
        });
      }
    }
  }
}

module.exports = StudentActivityJoinTable;

