const mockDataCollector = require('../mock-data-collector');
const injector = require('../table-dependency-injector');

class BaseTable {
  constructor(tableName, fieldNames, dependentTableNames) {
    this.tableName = tableName;
    this.fieldNames = fieldNames;
    this.dependentTableNames = dependentTableNames || [];
    this.isMockDataEnsured = false;

    injector.registerTable(this);
  }

  ensureMockData() {
    if (!this.isMockDataEnsured) {
      for (const dependentTableName of this.dependentTableNames) {
        const dependentTable = injector.getTable(dependentTableName);
        dependentTable.ensureMockData();
      }
      mockDataCollector.registerTable(this);
      console.log(`Generating data for table ${this.tableName}...`);
      this.isMockDataEnsured = true;
      this.generateMockData();
    }
  }

  getDepTable(depTableName) {
    if (this.dependentTableNames.indexOf(depTableName) === -1) {
      throw new Error(`Requesting for non dependent table "${depTableName}" from "${this.tableName}".`);
    }
    return injector.getTable(depTableName);
  }

  putData(data) {
    mockDataCollector.addMockData(this, data);
  }

  getData() {
    return mockDataCollector.getDataOfTable(this);
  }
}

module.exports = BaseTable;
