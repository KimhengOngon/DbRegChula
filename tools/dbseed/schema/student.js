const BaseTable = require('./base-table');
const chance = require('chance')(Math.random);

function padToFive(number) {
  if (number <= 99999) { number = ('0000' + number).slice(-5); }
  return number;
}

class StudentTable extends BaseTable {
  constructor() {
    super('student', [
      'sid',
      'fname_th',
      'fname_en',
      'lname_th',
      'lname_en',
      'initial_name',
      'address_en',
      'address_th',
      'ent_year',
      'behav_score',
      'mid'
    ], ['major', 'department']);
    // NOTE: student is dependent on department because of student ID is up to the faculty,
    // which can be found on the department table.
  }

  generateMockData() {
    const majorData = super.getDepTable('major').getData();
    const departmentData = super.getDepTable('department').getData();

    const majorFacultyIDMapper = new Map();
    for (const major of majorData) {
      const department = departmentData.find(department => department.did === major.did);
      majorFacultyIDMapper.set(major, department.fid);
    }

    const randomBehavScore = () => {
      if (Math.random() < 0.1) {
        return Math.floor((0.05+0.95*Math.random()) * 20) * 5;
      }
      return 100;
    }

    let randomCounter = chance.integer({ min: 1, max: 20 });
    const firstNameList = [...require('../first-name.json')];
    const lastNameList = [...require('../last-name.json')];

    const fullNameSet = new Set();

    for (let i = 0; i < 1325; i++) {
      let firstNameIndex;
      let lastNameIndex;
      do {
        firstNameIndex = chance.integer({ min: 0, max: firstNameList.length - 1 });
        lastNameIndex = chance.integer({ min: 0, max: lastNameList.length - 1 });
      } while (fullNameSet.has(`${firstNameIndex} ${lastNameIndex}`));
      fullNameSet.add(`${firstNameIndex} ${lastNameIndex}`);

      const year = chance.integer({ min: 55, max: 59 });
      randomCounter += chance.integer({ min: 1, max: 10 });
      const address = chance.address();
      const major = majorData[chance.integer({ min: 0, max: majorData.length - 1 })];

      super.putData({
        sid: `${year}3${padToFive(randomCounter)}${majorFacultyIDMapper.get(major)}`,
        fname_th: firstNameList[firstNameIndex][0],
        fname_en: firstNameList[firstNameIndex][1],
        lname_th: lastNameList[lastNameIndex][0],
        lname_en: lastNameList[lastNameIndex][1],
        initial_name: (Math.random() < 0.4) ? 'นาย' : 'นางสาว',
        address_en: address,
        address_th: address,
        ent_year: (1957) + year,
        behav_score: randomBehavScore(),
        mid: major.mid
      });
    }
  }
}

module.exports = StudentTable;

