const BaseTable = require('./base-table');

class MajorTable extends BaseTable {
  constructor() {
    super('major', [
      'mid',
      'name_en',
      'name_th',
      'did',
      'required_lang',
      'required_approve'
    ], ['department']);
  }

  generateMockData() {
    const genRequiredNumber = (fullNumber) => {
      if (Math.random() > 0.2) {
        return fullNumber;
      }
      return 0;
    };    

    const departments = super.getDepTable('department').getData();
    let idCounter = 1;
    for (const department of departments) {
      if (department.name_en.includes('Electrical')) {
        super.putData({
          mid: idCounter,
          name_en: 'Communication ' + department.name_en,
          name_th: department.name_th + 'สื่อสาร',
          did: department.did,
          required_lang: genRequiredNumber(3),
          required_approve: genRequiredNumber(18)
        })
        super.putData({
          mid: idCounter + 1,
          name_en: 'Power ' + department.name_en,
          name_th: department.name_th + 'กำลัง',
          did: department.did,
          required_lang: genRequiredNumber(3),
          required_approve: genRequiredNumber(18)
        })
        idCounter += 2;
      } else {
        super.putData({
          mid: idCounter,
          name_en: department.name_en,
          name_th: department.name_th,
          did: department.did,
          required_lang: genRequiredNumber(6),
          required_approve: genRequiredNumber(15)
        })
        idCounter++;
      }
    }
  }
}

module.exports = MajorTable;

