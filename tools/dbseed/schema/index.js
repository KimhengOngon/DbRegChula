const ActivityTable = require('./activity');
const FacultyTable = require('./faculty');
const DepartmentTable = require('./department');
const MajorTable = require('./major');
const StudentTable = require('./student');
const StudentActivityAwardedTable = require('./student-activity-awarded');
const StudentActivityJoinTable = require('./student-activity-join');
const AbsentRecordTable = require('./absent-record');
const AbsentRecordHasStudentTable = require('./absent-record-has-student');
const CourseTable = require('./course');
const CoursePrerequisiteTable = require('./course-prerequisite');
const MajorCourseRequiredTable = require('./major-course-required');
const StudentSemesterInfoTable = require('./student-semester-info');
const EnrollmentTable = require('./enrollment');
const UserTable = require('./user');
const UserStudentAdviceTable = require('./user-student-advice');

module.exports = {
  ActivityTable,
  FacultyTable,
  DepartmentTable,
  MajorTable,
  StudentTable,
  StudentActivityAwardedTable,
  StudentActivityJoinTable,
  AbsentRecordTable,
  AbsentRecordHasStudentTable,
  CourseTable,
  CoursePrerequisiteTable,
  MajorCourseRequiredTable,
  StudentSemesterInfoTable,
  EnrollmentTable,
  UserTable,
  UserStudentAdviceTable,
};