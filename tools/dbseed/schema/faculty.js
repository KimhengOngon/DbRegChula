const BaseTable = require('./base-table');

class FacultyTable extends BaseTable {
  constructor() {
    super('faculty', ['fid', 'name_th', 'name_en'], []);
  }

  generateMockData() {
    const facultyData = [
      ['21', 'คณะวิศวกรรมศาสตร์', 'Faculty of Engineering'],
      ['22', 'คณะอักษรศาสตร์', 'Faculty of Arts'],
      ['23', 'คณะวิทยาศาสตร์', 'Faculty of Science'],
      ['25', 'คณะสถาปัตยกรรมศาสตร์', 'Faculty of Architecture']
    ]

    for (const faculty of facultyData) {
      super.putData({
        fid: faculty[0],
        name_th: faculty[1],
        name_en: faculty[2]
      })
    }
  }
}

module.exports = FacultyTable;

