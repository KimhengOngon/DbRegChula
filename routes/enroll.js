const express = require('express');
const router = express.Router();
const db = require('../db');
const moment = require('moment');

router.post('/detail', function(req, res) {
  let sql = `SELECT created_time, edited_time, e.course_no, grade, credit, shortname FROM enrollment e inner join course c on e.course_no = c.course_no
  where e.sid = ? AND e.year = ? AND e.semester = ?`;
  let inserts = [req.body.sid, req.body.year, req.body.semester];
  db.query(sql, inserts,
    (err, rows) => {
      if (err) {
        return next(err);
      }
      console.log(rows);
      res.send(rows)
    }
  );
})

router.post('/summary', function(req, res) {
  let sql = `select gpax, gpx, cax, cgx,gpa,ca,cg, T123.sid from (select gpax, gpx, cax, cgx,gpa,ca,T12.sid from (select gpax, gpx, cax, cgx, T1.sid from (select sum(
replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(e.grade,'A','4'),'B+','3.5'),'B','3'),'C+','2.5'),'C','2'),'D+','1.5'),'D','1'),'F','0'),'W','0'),'-','0')
* credit) / sum(credit) as gpax,
sum(
replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(e.grade,'A','4'),'B+','3.5'),'B','3'),'C+','2.5'),'C','2'),'D+','1.5'),'D','1'),'F','0'),'W','0'),'-','0')
* credit) as gpx,
sum(credit)  as cax,
 sid
from enrollment e inner join course c on e.course_no= c.course_no
where e.grade != 'W' and e.grade != '-' and (year < ? or (year = ? and semester <= ?)) group by sid) as T1 inner join
(select
sum(credit) as cgx,
 sid
from enrollment e inner join course c on e.course_no= c.course_no where e.grade != 'W' and e.grade != '-'  and e.grade != 'F'and (year < ? or (year = ? and semester <= ?))
group by sid) as T2
on T1.sid = T2.sid) as T12 inner join
(select sum(
replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(e.grade,'A','4'),'B+','3.5'),'B','3'),'C+','2.5'),'C','2'),'D+','1.5'),'D','1'),'F','0'),'W','0'),'-','0')
* credit) / sum(credit) as gpa,
sum(credit)  as ca,
 sid
from enrollment e inner join course c on e.course_no= c.course_no
where e.grade != 'W' and e.grade != '-' and e.year = ? and e.semester = ? group by sid) as T3
on T12.sid = T3.sid) as T123 inner join
(select
sum(credit) as cg,
 sid
from enrollment e inner join course c on e.course_no= c.course_no
where e.grade != 'W' and e.grade != '-'  and e.grade != 'F'
and e.year = ? and e.semester = ?
group by sid) as T4
on T123.sid = T4.sid
where T123.sid = ?
`;
  let inserts = [req.body.year,req.body.year,req.body.semester,
    req.body.year,req.body.year,req.body.semester
    ,req.body.year,req.body.semester,req.body.year,req.body.semester,req.body.sid];
  db.query(sql, inserts,
    (err, rows) => {
      res.send(rows[0])
    }
  );
})

function encodeGrade(grade) {
  if (grade == 'A') {
    return 4;
  } else if (grade == 'B+') {
    return 3.5;
  } else if (grade == 'B') {
    return 3;
  } else if (grade == 'C+') {
    return 2.5;
  } else if (grade == 'C') {
    return 2;
  } else if (grade == 'D+') {
    return 1.5;
  } else if (grade == 'D') {
    return 1;
  } else if (grade == 'F' || grade == 'W') {
    return 0;
  }
}

function temp_sum() {
  return {
    "2011": {
      "1": 0,
      "2": 0
    },
    "2012": {
      "1": 0,
      "2": 0
    },
    "2013": {
      "1": 0,
      "2": 0
    },
    "2014": {
      "1": 0,
      "2": 0
    },
    "2015": {
      "1": 0,
      "2": 0
    },
    "2016": {
      "1": 0,
      "2": 0
    },
  }
}

function decodeSemester(code, ent_year) {
  let semester = code % 2
  if (semester == 0) {
    semester = 2
  }
  let year = (code - semester) / 2 + Number(ent_year)
  return {year: year, semester: semester}
}

function encodeSemester(year, semester, ent_year) {
  return (year - ent_year) * 2 + semester
}
module.exports = router;
