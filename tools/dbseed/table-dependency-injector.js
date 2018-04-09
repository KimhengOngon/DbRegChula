class TableDependencyInjector {
  constructor() {
    this.nameMapper = new Map();
  }

  registerTable(table) {
    this.nameMapper.set(table.tableName, table);
  }

  getTable(tableName) {
    const table = this.nameMapper.get(tableName);
    if (table) {
      return table;
    } else {
      throw new Error(`No registered table with name "${tableName}".`);
    }
  }
}

module.exports = new TableDependencyInjector();
