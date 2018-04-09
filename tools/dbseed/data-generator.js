const schemas = require('./schema');
const mockDataCollector = require('./mock-data-collector');

class DataGenerator {
  constructor(isForce) {
    this.isForce = isForce;
  }

  run() {
    const activityTable = new schemas.ActivityTable();
    const facultyTable = new schemas.FacultyTable();
    const departmentTable = new schemas.DepartmentTable();
    const majorTable = new schemas.MajorTable();
    const studentTable = new schemas.StudentTable();
    const studentActivityAwardedTable = new schemas.StudentActivityAwardedTable();
    const studentActivityJoinTable = new schemas.StudentActivityJoinTable();
    const absentRecordTable = new schemas.AbsentRecordTable();
    const absentRecordHasStudentTable = new schemas.AbsentRecordHasStudentTable();
    const courseTable = new schemas.CourseTable();
    const coursePrerequisiteTable = new schemas.CoursePrerequisiteTable();
    const majorCourseRequiredTable = new schemas.MajorCourseRequiredTable();
    const studentSemesterInfoTable = new schemas.StudentSemesterInfoTable();
    const enrollmentTable = new schemas.EnrollmentTable();
    const userTable = new schemas.UserTable();
    const userStudentAdviceTable = new schemas.UserStudentAdviceTable();

    activityTable.ensureMockData();
    facultyTable.ensureMockData();
    departmentTable.ensureMockData();
    majorTable.ensureMockData();
    studentTable.ensureMockData();
    studentActivityAwardedTable.ensureMockData();
    studentActivityJoinTable.ensureMockData();
    absentRecordTable.ensureMockData();
    absentRecordHasStudentTable.ensureMockData();
    courseTable.ensureMockData();
    coursePrerequisiteTable.ensureMockData();
    majorCourseRequiredTable.ensureMockData();
    studentSemesterInfoTable.ensureMockData();
    enrollmentTable.ensureMockData();
    userTable.ensureMockData();
    userStudentAdviceTable.ensureMockData();

    return mockDataCollector.logDataset()
      .then(() => mockDataCollector.insertDatasetToDatabaseAsync(this.isForce));
  }
}

module.exports = DataGenerator;
