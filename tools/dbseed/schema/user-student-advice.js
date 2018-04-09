const BaseTable = require('./base-table');
const chance = require('chance')();

class UserStudentAdviceTable extends BaseTable {
  constructor() {
    super('user_student_advice', ['user_id', 'student_sid'], ['user', 'student', 'major']);
  }

  generateMockData() {
    const userData = super.getDepTable('user').getData();
    const studentData = super.getDepTable('student').getData();
    const majorData = super.getDepTable('major').getData();


    for (const user of userData) {
      if (user.type === 'A') {
        const computerEngMajorID = majorData.find(major => major.name_en.includes('Computer Engineering')).mid;
        const compEngStudents = studentData.filter(student => student.mid === computerEngMajorID);

        const studentsInAdvice = chance.pickset(compEngStudents, 37);

        for (const student of studentsInAdvice) {
          super.putData({
            user_id: user.id,
            student_sid: student.sid
          });
        }
      }
    }
  }
}

module.exports = UserStudentAdviceTable;

