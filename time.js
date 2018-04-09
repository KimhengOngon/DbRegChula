const moment = require('moment');

exports.getYearAndSemester = function () {
  const t = moment().subtract(7, 'months');
  return {
    year: t.year(),
    semester: t.month() <= 6 ? 1 : 2
  };
};
