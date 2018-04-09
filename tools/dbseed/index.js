const program = require('commander');
const DataGenerator = require('./data-generator');

program
  .version('0.0.1')
  .option('-i, --insert-mock-data', 'Insert mocked data into database')
  .option('-f, --force', 'Allow deleting old data in the table if already have one before')
  .parse(process.argv);

function run() {
  const isForce = program.force;
  const { insertMockData } = program;

  let showHelp = true;

  let runQueue = Promise.resolve();

  if (insertMockData) {
    showHelp = false;
    const dataGenerator = new DataGenerator(isForce);
    runQueue = runQueue.then(() => dataGenerator.run());
  }

  runQueue.then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });

  if (showHelp) {
    program.outputHelp();
  }
}

run();
