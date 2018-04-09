const BaseTable = require('./base-table');

class DepartmentTable extends BaseTable {
  constructor() {
    super('department', ['did', 'name_th', 'name_en', 'fid'], ['faculty']);
  }

  generateMockData() {
    const departmentMapper = {
      '21': ['วิศวกรรม', 'Engineering'],
      '22': ['อักษรศาสตร์เอก', 'Arts'],
      '23': ['วิทยาศาสตร์', 'Science'],
      '25': ['สถาปัตยกรรม', 'Architecture']
    };
    
    const departmentKeywords = [
      ['คอมพิวเตอร์', 'Computer'],
      ['ไฟฟ้า', 'Electrical'],
      ['โยธา', 'Civil'],
      ['นิวเคลียร์', 'Nuclear'],
      ['เคมี', 'Chemical']
    ];

    const faculties = super.getDepTable('faculty').getData();
    for (let i = 0; i < faculties.length; i++) {
      const faculty = faculties[i];
      const shortFacultyNameTH = departmentMapper[faculty.fid][0];
      const shortFacultyNameEN = departmentMapper[faculty.fid][1];
      for (let j = 0; j < Math.max(2, departmentKeywords.length - i); j++) {
        const keyword = departmentKeywords[j];
        super.putData({
          did: i * 100 + j + 1,
          name_th: shortFacultyNameTH + keyword[0],
          name_en: keyword[1] + ' ' + shortFacultyNameEN,
          fid: faculty.fid
        });
      }
    }
  }
}

module.exports = DepartmentTable;

