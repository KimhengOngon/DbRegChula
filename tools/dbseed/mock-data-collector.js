const fs = require('fs');
const ProgressBar = require('progress');
const db = require('./db');

class MockDataCollector {
  constructor() {
    this.datasetMap = new Map();
    this.tableInsertOrder = [];
  }

  clear() {
    this.datasetMap.clear();
    this.tableInsertOrder = [];
  }

  registerTable(table) {
    if (!this.datasetMap.has(table)) {
      this.datasetMap.set(table, []);
      this.tableInsertOrder.push(table);
    }
  }

  addMockData(table, data) {
    this.datasetMap.get(table).push(data);
  }

  getDataOfTable(table) {
    return this.datasetMap.get(table);
  }

  logDataset() {
    const logFileName = 'db-dump.log';
    return new Promise((resolve) => {
      const stream = fs.createWriteStream(logFileName);
      stream.once('open', () => {
        stream.write('\n');
        for (const table of this.tableInsertOrder) {
          const tableData = this.datasetMap.get(table);

          stream.write('====================\n');
          stream.write(`TABLE: ${table.tableName}\n`);
          stream.write('Fields: ' + table.fieldNames.join(', ') + '\n');
          stream.write(`Count: ${tableData.length}` + '\n');
          stream.write('----------\n');

          for (const row of tableData) {
            const data = [];
            for (const fieldName of table.fieldNames) {
              data.push(row[fieldName]);
            }
            stream.write(data.join(', ') + '\n');
          }

          stream.write('====================\n');
          stream.write('\n');
          stream.write('\n');
        }
        stream.end();
      });
      stream.once('close', () => {
        console.log(`Dumped data can be seen in ${logFileName} file.`);
        resolve();
      });
    });
  }

  insertDatasetToDatabaseAsync(isForce) {
    // PRE-CHECK DATA IN TABLE

    let p = this.checkTable(isForce);

    // INSERT DATA INTO A TABLE

    let progressBar;

    const insertRows = (tableName, fieldNames, data) => {
      p = p.then(() => new Promise((resolve, reject) => {
        const sql = `INSERT INTO ${tableName} (${fieldNames.join(', ')}) VALUES ?`;
        db.query(sql, [data], (err) => {
          if (err) {
            console.error(`Error on inserting data into table ${tableName}.`);
            return reject(err);
          }
          progressBar.tick(data.length);
          resolve();
        })
      }));
    };

    for (const table of this.tableInsertOrder) {
      const tableData = this.datasetMap.get(table);
      const tableName = table.tableName;

      p = p.then(() => {
        console.log(`Inserting data to table "${tableName}"...`);
        progressBar = new ProgressBar(`[:bar] :current/:total :percent (finished in :eta sec.)`, {
          width: 30,
          total: tableData.length
        });
      });

      let datas = [];
      for (const row of tableData) {
        const data = [];
        for (const fieldName of table.fieldNames) {
          data.push(row[fieldName]);
        }
        datas.push(data);
        if (datas.length >= 1000) {
          // Flush
          insertRows(table.tableName, table.fieldNames, datas);
          datas = [];
        }
      }
      if (datas.length > 0) {
        insertRows(table.tableName, table.fieldNames, datas);
      }
    }

    return p.then(() => {
      console.log('Inserting to data complete.');
    });
  }

  checkTable(isForce) {
    let p = Promise.resolve();
    const tableCheckOrder = [...this.tableInsertOrder].reverse();

    let truncateQueue = [];

    for (const table of tableCheckOrder) {
      const tableName = table.tableName;
      p = p.then(() => new Promise((resolve, reject) => {
        console.log(`Checking table "${tableName}"...`);
        db.query(`SELECT COUNT(*) as count FROM ${tableName}`, (err, results) => {
          if (err) {
            return reject(err);
          }

          const rowCount = results[0].count;
          if (rowCount !== 0) {
            if (isForce) {
              truncateQueue.push(tableName);
              console.log(`NOTE: Will truncate table "${tableName}".`);
            } else {
              return reject(new Error(
                `There is already a data (${rowCount} rows) in table "${tableName}". ` +
                'Please remove any data from that table or running this program using --force flag.'
              ));
            }
          }

          resolve();
        });
      }));
    }

    if (isForce) {
      p = p.then(() => this.truncateTable(truncateQueue));
    }

    return p.then(() => {
      console.log(`Table checking complete.`);
    });
  }

  truncateTable(tableNames) {
    let p = Promise.resolve();
    for (const tableName of tableNames) {
      p = p.then(() => new Promise((resolve, reject) => {
        console.log(`Truncating table "${tableName}"`);
        db.query(`DELETE FROM ${tableName}`, (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      })).then(() => new Promise((resolve, reject) => {
        db.query(`ALTER TABLE ${tableName} AUTO_INCREMENT = 0`, (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      }));
    }
    return p;
  }
}

module.exports = new MockDataCollector();
