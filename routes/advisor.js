const express = require('express');
const db = require('../db');
const { queryAsPromise } = require('../db-helper');
const moment = require('moment');

const router = express.Router();

router.get('/', function (req, res, next) {


  var yrall = `SELECT sid, fname_th, lname_th, ent_year, m_name, d_name,behav_score, f_name, (SUM(ngrade*credit)/SUM(credit)) as GPAX
      FROM (SELECT sid,fname_th,lname_th,fname_en,lname_en,ent_year,behav_score,mid FROM dbproject.student) AAA
      NATURAL JOIN (SELECT user_id, student_sid as 'sid' FROM dbproject.user_student_advice WHERE user_id = ?) BBB
      NATURAL JOIN (SELECT mid, did, name_th as 'm_name' FROM dbproject.major) CCC
      NATURAL JOIN (SELECT did, fid ,name_th as 'd_name' FROM dbproject.department) DDD
      NATURAL JOIN (SELECT fid, name_th as 'f_name' FROM dbproject.faculty) EEE
      NATURAL JOIN (SELECT sid, grade, (CASE grade WHEN 'A' then 4 WHEN 'B+' then 3.5 WHEN 'B' then 3 WHEN 'C+' then 2.5 WHEN 'C' then 2 WHEN 'D+' then 1.5 WHEN 'D' then 1 WHEN 'F' then 0 else 0 end) AS ngrade, course_no FROM dbproject.enrollment WHERE grade != 'W' AND grade != '-') GGG
      NATURAL JOIN (SELECT course_no, credit FROM dbproject.course) HHH `;
  var absent =`SELECT *
      FROM (SELECT sid,fname_th,lname_th,ent_year FROM student) AAA
      NATURAL JOIN (SELECT user_id,student_sid as 'sid' FROM user_student_advice) BBB
      NATURAL JOIN (SELECT sid,arid FROM absent_record_has_student) CCC
      NATURAL JOIN (SELECT arid,start_date,end_date,name as cause,description FROM absent_record) DDD WHERE user_id = ? AND start_date <= CURDATE() AND end_date >= CURDATE()`;
  var p_absent =`SELECT *
      FROM (SELECT sid,fname_th,lname_th,ent_year FROM student) AAA
      NATURAL JOIN (SELECT user_id,student_sid as 'sid' FROM user_student_advice) BBB
      NATURAL JOIN (SELECT sid,arid FROM absent_record_has_student) CCC
      NATURAL JOIN (SELECT arid,start_date,end_date,name as cause,description FROM absent_record) DDD WHERE user_id = ? AND end_date < CURDATE()`;

  var yyy = new Date().getFullYear() + Math.floor(new Date().getMonth()/12 + 4/12);
  var yra = yrall + ` GROUP BY sid`
  var yr1 = yrall + ` WHERE `+ yyy +` - ent_year = 1 GROUP BY sid`;
  var yr2 = yrall + ` WHERE `+ yyy +` - ent_year = 2 GROUP BY sid`;
  var yr3 = yrall + ` WHERE `+ yyy +` - ent_year = 3 GROUP BY sid`;
  var yr4 = yrall + ` WHERE `+ yyy +` - ent_year = 4 GROUP BY sid`;
  var yr5 = yrall + ` WHERE `+ yyy +` - ent_year >= 5 GROUP BY sid`;

  Promise.all([
    queryAsPromise(yra, [req.user.id]),
    queryAsPromise(yr1, [req.user.id]),
    queryAsPromise(yr2, [req.user.id]),
    queryAsPromise(yr3, [req.user.id]),
    queryAsPromise(yr4, [req.user.id]),
    queryAsPromise(yr5, [req.user.id]),
    queryAsPromise(absent, [req.user.id]),
    queryAsPromise(p_absent, [req.user.id]),
  ]).then((results) => {
    res.render('advisor', {
      tab1: results[0].rows,
      tab2: results[6].rows,
      tab3: results[7].rows,
      y1t: results[1].rows,
      y2t: results[2].rows,
      y3t: results[3].rows,
      y4t: results[4].rows,
      y5t: results[5].rows,
      moment: moment,
      user: req.user
    })
  }).catch(err => next(err));

});

module.exports = router;
