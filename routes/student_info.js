const express = require('express');
const moment = require('moment');
const db = require('../db');
const { queryAsPromise } = require('../db-helper');
const { buildDataTableEndpoint } = require('./helper/data-table-helper');

const router = express.Router();

router.get('/', function (req, res) {
  // It comes from <input type="hidden" ...>
  if (req.query.search === 'y') {
    const searchOptions = {
      sid: req.query.sid,
      sfname: req.query.sfname,
      slname: req.query.slname,
      student_year: req.query.student_year,
      score_constrain: req.query.score_constrain,
      behav_score: req.query.behav_score,
      mid: req.query.mid,
      address_en: req.query.address_en
    };

    res.render('student_info/main', {
      searched: true,
      searchOptions: searchOptions,
      user: req.user
    });
  } else {
    res.render('student_info/main', {
      searched: false,
      user: req.user
    });
  }
});

router.get('/search-data', buildDataTableEndpoint((queryOptions) => {
  const { start, length, sortOptions, additionalOptions } = queryOptions;

  // prepare for actual query

  const studentID = additionalOptions.sid;
  const studentFirstName = additionalOptions.sfname;
  const studentLastName = additionalOptions.slname;
  const studentYear = additionalOptions.student_year;
  const scoreConstrain = additionalOptions.score_constrain;
  const studentBehaviorScore = additionalOptions.behav_score;
  const studentMajorID = additionalOptions.mid;
  const studentAddress = additionalOptions.address_en;
  const currentYear = moment().year();

  // all like
  let baseSQL = "FROM student WHERE sid LIKE ? AND fname_en LIKE ? AND lname_en LIKE ? AND address_en LIKE ? ";
  let queryData = [studentID.trim() + '%', '%' + studentFirstName.trim() + '%', '%' + studentLastName.trim() + '%', '%' + studentAddress + '%'];
  if (studentYear && studentYear.length > 0) {
    baseSQL += "AND ent_year = ? ";
    queryData.push(currentYear - studentYear + 1);
  }
  if (studentBehaviorScore && studentBehaviorScore.length > 0 && scoreConstrain != "") {
    if (scoreConstrain == ">") baseSQL += "AND behav_score > ? ";
    else if (scoreConstrain == "<") baseSQL += "AND behav_score < ? ";
    else if (scoreConstrain == "=") baseSQL += "AND behav_score = ? ";

    queryData.push(studentBehaviorScore);
  }
  if (studentMajorID && studentMajorID.length > 0) {
    baseSQL += "AND mid = ? ";
    queryData.push(studentMajorID);
  }

  // we use `dataSQL` to query by using data table's information to limit and sort
  let dataSQL = 'SELECT * ' + baseSQL;
  if (sortOptions) {
    let dbFieldName = sortOptions.fieldName;
    if (dbFieldName === 'year') {
      dbFieldName = 'ent_year';
    } else if (dbFieldName === 'behaviorScore') {
      dbFieldName = 'behav_score';
    }

    dataSQL += ` ORDER BY ${dbFieldName} ${sortOptions.isAscending ? 'ASC' : 'DESC'}`;
  }
  dataSQL += ` LIMIT ${length} OFFSET ${start}`;

  // for `countFilteredSQL`, we just want to count the number of data that is filtered above
  const countFilteredSQL = 'SELECT COUNT(*) as filteredStudentCount ' + baseSQL;

  // for `countAllSQL`, we want to count "all" data in the table before filtered
  const countAllSQL = 'SELECT COUNT(*) as totalStudentCount FROM student';

  return Promise.all([
    queryAsPromise(countAllSQL),
    queryAsPromise(countFilteredSQL, queryData),
    queryAsPromise(dataSQL, queryData)
  ]).then(results => {
    const totalCount = results[0].rows[0].totalStudentCount;
    const filteredCount = results[1].rows[0].filteredStudentCount;
    const data = results[2].rows.map(row => {
      return {
        sid: row.sid,
        fname_en: row.fname_en,
        lname_en: row.lname_en,
        year: row.ent_year,
        behaviorScore: row.behav_score
      };
    });

    return { totalCount, filteredCount, data };
  });
}));

router.get('/:sid', function (req, res, next) {
  let sql = "SELECT * FROM student where sid = ? ";
  let inserts = [req.params.sid];
  db.query(sql, inserts,
    (err, rows) => {
      if (err) {
        return next(err);
      }
      rows[0].year = 4 - (Number(rows[0].ent_year) - 2013)
      res.render('student_info/full_info', {
        sid: req.params.sid,
        user: req.user,
        studentInfo: rows[0]
      });
    }
  );
})

router.get('/:sid/enroll', function (req, res) {
  let sql = "SELECT * FROM student where sid = ? ";
  let inserts = [req.params.sid];
  db.query(sql, inserts,
    (err, rows) => {
      if (err) {
        return next(err);
      }
      rows[0].year = 4 - (Number(rows[0].ent_year) - 2013)
      res.render('student_info/enrollment', {
        sid: req.params.sid,
        user: req.user,
        studentInfo: rows[0],
        ent_year: rows[0].ent_year
      });
    }
  );
});

router.get('/:sid/indiv-activity', function (req, res, next) {
  const studentID = req.params.sid;

  if (studentID && studentID.length > 0) {
    //"SELECT YEAR(activity.start_date) as 'year', sum(activity.duration) as 'sum', activity.aid, activity.name, activity.start_date, activity.duration, student_activity_awarded.award FROM student JOIN student_activity_join ON student.sid = student_activity_join.sid JOIN activity ON student_activity_join.aid = activity.aid LEFT JOIN student_activity_awarded ON student_activity_awarded.sid = student.sid AND student_activity_awarded.aid = activity.aid WHERE ? = student.sid group by YEAR(activity.start_date)"
    let Activity_sql = "SELECT YEAR(activity.start_date) as 'year', activity.aid, activity.name, activity.start_date, activity.duration, student_activity_awarded.award  FROM student JOIN student_activity_join ON student.sid = student_activity_join.sid JOIN activity ON student_activity_join.aid = activity.aid LEFT JOIN student_activity_awarded ON student_activity_awarded.sid = student.sid AND student_activity_awarded.aid = activity.aid WHERE ? = student.sid";
    let Student_sql = "select * from student where sid = ?";
    let inserts = [studentID.trim()];
    // db.query(sql, inserts,
    //   (err, rows) => {
    //     if (err) {
    //       return next(err);
    //     }
    //     console.log(rows);
    //     res.render('student_info/indiv_activity', {
    //       searched: true,
    //       total: rows.length,
    //       sid: studentID,
    //       data: rows,
    //       moment: moment,
    //       user: req.user,
    //       studentInfo: rows[0]
    //     });
    //   }
    // );
    return Promise.all([
      queryAsPromise(Activity_sql, inserts),
      queryAsPromise(Student_sql, inserts),
    ]).then(results => {
      // const totalCount = results[0].rows[0].totalStudentCoun`t;
      // const filteredCount = results[1].rows[0].filteredStudent`Count;
      console.log(results[0]);
      console.log(results[1]);
      res.render('student_info/indiv_activity', {
        searched: true,
        total: results[0].rows.length,
        sid: studentID,
        data: results[0].rows,
        moment: moment,
        user: req.user,
        studentInfo: results[1].rows[0]

        // sid: row.sid,
        // fname_en: row.fname_en,
        // lname_en: row.lname_en,
        // year: row.ent_year,
        // behaviorScore: row.behav_score
      });
    });
  } else {
    res.render('common/not_found');
  }
});

router.get('/:sid/studying-analysis', function (req, res, next) {
  const sid = req.params.sid;
  Promise.all([
    queryAsPromise('SELECT fname_th, fname_en, lname_th, lname_en FROM student WHERE sid = ?', [sid]),
    queryAsPromise(
      `
SELECT
    course.course_no AS course_no,
    course.name_en AS course_name,
    course.credit AS credit,
    enrollment.grade AS grade
FROM
    enrollment
        JOIN
    (SELECT
        MAX(edited_time) AS edited_time
    FROM
        enrollment
    WHERE
        enrollment.sid = ?
            AND NOT (enrollment.grade = 'A'
            OR enrollment.grade = 'B+'
            OR enrollment.grade = 'B'
            OR enrollment.grade = 'C+'
            OR enrollment.grade = 'C'
            OR enrollment.grade = 'D+'
            OR enrollment.grade = 'D'
            OR enrollment.grade = '-')
    GROUP BY course_no
    ORDER BY course_no) AS A ON A.edited_time = enrollment.edited_time
        JOIN
    course ON course.course_no = enrollment.course_no
WHERE
    enrollment.sid = ?
        AND NOT (enrollment.grade = 'A'
        OR enrollment.grade = 'B+'
        OR enrollment.grade = 'B'
        OR enrollment.grade = 'C+'
        OR enrollment.grade = 'C'
        OR enrollment.grade = 'D+'
        OR enrollment.grade = 'D'
        OR enrollment.grade = '-')
      `,
      [sid, sid]
    ),
    queryAsPromise(
      `
SELECT
    course.course_no AS course_no,
    course.name_en AS course_name,
    course.credit AS credit,
    enrollment.grade AS grade
FROM
    enrollment
        JOIN
    course ON course.course_no = enrollment.course_no
WHERE
    enrollment.sid = ?
        AND (enrollment.grade = 'A'
        OR enrollment.grade = 'B+'
        OR enrollment.grade = 'B'
        OR enrollment.grade = 'C+'
        OR enrollment.grade = 'C'
        OR enrollment.grade = 'D+'
        OR enrollment.grade = 'D')
      `,
      [sid]
    ),
    queryAsPromise(
      `
SELECT
    course.course_no AS course_no,
    course.name_en AS course_name,
    course.credit AS credit
FROM
    student
        JOIN
    major_course_required ON major_course_required.mid = student.mid
        JOIN
    course ON course.course_no = major_course_required.course_no
WHERE
    sid = ?
        AND course.course_no NOT IN (SELECT DISTINCT
            course_no
        FROM
            enrollment
        WHERE
            enrollment.sid = ?)
      `,
      [sid, sid]
    ),
    queryAsPromise(
      `
SELECT
    required_lang as requiredLang, required_approve as requiredApprove
FROM
    major
        JOIN
    student ON major.mid = student.mid
    WHERE student.sid = ?
      `,
      [sid]
    ),
    queryAsPromise(
      `
SELECT
    course.course_no AS course_no,
    course.name_en AS course_name,
    course.credit AS credit,
    enrollment.grade AS grade
FROM
    enrollment
        JOIN
    course ON course.course_no = enrollment.course_no
WHERE
    enrollment.sid = ?
        AND (special_type = '6')
        AND (enrollment.grade = 'A'
        OR enrollment.grade = 'B+'
        OR enrollment.grade = 'B'
        OR enrollment.grade = 'C+'
        OR enrollment.grade = 'C'
        OR enrollment.grade = 'D+'
        OR enrollment.grade = 'D')
      `,
      [sid]
    ),
    queryAsPromise(
      `
SELECT
    course.course_no AS course_no,
    course.name_en AS course_name,
    course.credit AS credit,
    enrollment.grade AS grade
FROM
    enrollment
        JOIN
    course ON course.course_no = enrollment.course_no
WHERE
    enrollment.sid = ?
        AND (special_type = '1' OR special_type = '2'
        OR special_type = '3'
        OR special_type = '4')
        AND (enrollment.grade = 'A'
        OR enrollment.grade = 'B+'
        OR enrollment.grade = 'B'
        OR enrollment.grade = 'C+'
        OR enrollment.grade = 'C'
        OR enrollment.grade = 'D+'
        OR enrollment.grade = 'D')
      `,
      [sid]
    ),
    queryAsPromise(
      `
SELECT
    course.course_no AS course_no,
    course.name_en AS course_name,
    course.credit AS credit,
    enrollment.grade AS grade
FROM
    enrollment
        JOIN
    course ON course.course_no = enrollment.course_no
WHERE
    enrollment.sid = ?
        AND (special_type = '5')
        AND (enrollment.grade = 'A'
        OR enrollment.grade = 'B+'
        OR enrollment.grade = 'B'
        OR enrollment.grade = 'C+'
        OR enrollment.grade = 'C'
        OR enrollment.grade = 'D+'
        OR enrollment.grade = 'D')
      `,
      [sid]
    )
  ]).then((results) => {
    if (results.length === 0) {
      return next(new Error(`Student with ID ${sid} not found.`));
    }
    const studentInfo = results[0].rows[0];
    const strugglingCourseDetail = results[1].rows;
    const passedCourseDetail = results[2].rows;
    const remainedCourseDetail = results[3].rows;
    const { requiredLang, requiredApprove } = results[4].rows[0];
    const approveCourseDetail = results[5].rows;
    const genedCourseDetail = results[6].rows;
    const langCourseDetail = results[7].rows;

    const strugglingCourseCreditSum = results[1].rows.map(r=>r.credit).reduce((a,b)=>a+b,0);
    const passedCourseCreditSum = results[2].rows.map(r=>r.credit).reduce((a,b)=>a+b,0);
    const remainedCourseCreditSum = results[3].rows.map(r=>r.credit).reduce((a,b)=>a+b,0);
    const approveCourseCreditSum = results[5].rows.map(r=>r.credit).reduce((a,b)=>a+b,0);
    const genedCourseCreditSum = results[6].rows.map(r=>r.credit).reduce((a,b)=>a+b,0);
    const langCourseCreditSum = results[7].rows.map(r=>r.credit).reduce((a,b)=>a+b,0);

    res.render('student_info/studying_analysis', {
      passedCourseDetail,
      strugglingCourseDetail,
      remainedCourseDetail,
      sid: req.params.sid,
      user: req.user,
      studentInfo,
      requiredLang,
      requiredApprove,
      approveCourseDetail,
      genedCourseDetail,
      langCourseDetail,
      strugglingCourseCreditSum,
      passedCourseCreditSum,
      remainedCourseCreditSum,
      approveCourseCreditSum,
      genedCourseCreditSum,
      langCourseCreditSum
    });

  }).catch((err) => next(err));
})

module.exports = router;
