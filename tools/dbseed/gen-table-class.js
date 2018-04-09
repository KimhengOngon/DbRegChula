function generateTableClassFileData(modelName, tableName, fieldNames) {
  return `const BaseTable = require('./base-table');

class ${modelName}Table extends BaseTable {
  constructor() {
    super('${tableName}', [${fieldNames.map(name => `'${name}'`).join(', ')}], []);
  }

  generateMockData() {
  }
}

module.exports = ${modelName}Table;
`;
}

const modelName = process.argv[2];
const tableName = process.argv[3];
const fieldNames = process.argv.slice(4);
console.log(generateTableClassFileData(modelName, tableName, fieldNames));
