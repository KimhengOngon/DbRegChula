const BaseTable = require('./base-table');

class StudentSemesterInfoTable extends BaseTable {
  constructor() {
    super('student_semester_info', ['sid', 'semester', 'year'], ['student']);
  }

  generateMockData() {
    const studentData = super.getDepTable('student').getData();
    for (const student of studentData) {
      for (var i = student.ent_year; i <= 2016; i++) {
        super.putData({
          sid: student.sid,
          semester: 1,
          year: i
        })
        super.putData({
          sid: student.sid,
          semester: 2,
          year: i
        })
      }
    }
  }
}

module.exports = StudentSemesterInfoTable;
