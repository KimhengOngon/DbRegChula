const BaseTable = require('./base-table');

class CoursePrerequisiteTable extends BaseTable {
  constructor() {
    super('course_prerequisite', ['course_no', 'pre_course_no'], ['course']);
  }

  generateMockData() {
    const course_pre = [...require('../course_pre.json')];
    for (let i = 0; i < course_pre.length; i++) {
      super.putData(course_pre[i])
    }
  }
}

module.exports = CoursePrerequisiteTable;
