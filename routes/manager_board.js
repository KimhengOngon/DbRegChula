const express = require('express');
const db = require('../db');
const dbHelper = require('../db-helper');
const moment = require('moment');
const router = express.Router();


router.get('/', function(req, res, next) {
  /*
  dbHelper.queryAsPromise('SELECT ent_year, count(sid) as count FROM student GROUP BY ent_year')
    .then(function (data) {
      const rows = data.rows;
      let studentNum = [];
      let m
      for(let i=0;i<rows.length;i++){
        studentNum.push(rows[i].count);
      }
      console.log(studentNum);
      res.render('manager_board', {
        data: rows,
        studentNum : studentNum,
        serverTime: moment().format('LLLL')
      });
    });

  Promise.all([
    dbHelper.queryAsPromise('...', []),
    dbHelper.queryAsPromise('...', []),
    dbHelper.queryAsPromise('...', []),
    dbHelper.queryAsPromise('...', [])
  ]).then((data) => {
    const result1 = data[0].rows;
    const result1 = data[1].rows;
    const result1 = data[2].rows;
    const result1 = data[3].rows;

    res.render('...', {
      result1.rows
    })
  });*/


  //Get Student Info Summary data
  db.query(
    'SELECT ent_year, count(sid) as count FROM student GROUP BY ent_year;',
    (err, rows) => {
      if (err) {
        return next(err);
      }
      console.log(rows);
      let studentNum = [];
      for (let i = 0; i < rows.length; i++) {
        studentNum.push(rows[i].count);
      }
      console.log(studentNum);
      res.render('manager_board', {
        data: rows,
        studentNum: studentNum,
        user: req.user
      });
    }
  );

});

router.get('/grade', function(req, res) {
  // res.send('test')
  db.query(
    `select avg(t.gpax) as gpax from (select sum(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(e.grade,'A','4'),'B+','3.5'),'B','3'),'C+','2.5'),'C','2'),'D+','1.5'),'D','1'),'F','0'),'W','0'),'-','0') * credit) / sum(credit) as gpax, sid, 1 as temp
from enrollment e inner join course c on e.course_no= c.course_no
where e.grade != 'W' and e.grade != '-' group by sid) as t group by t.temp`,
    (err, rows) => {
      if (err) {
        return next(err);
      }
      console.log(rows[0]);
      res.send(rows[0])
    }
  );
});

router.get('/year', function(req, res) {
  // res.send('test')
  db.query(
    `select avg(t.gpax) as gpax from (select sum(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(e.grade,'A','4'),'B+','3.5'),'B','3'),'C+','2.5'),'C','2'),'D+','1.5'),'D','1'),'F','0'),'W','0'),'-','0') * credit) / sum(credit) as gpax, s.sid, ent_year
from enrollment e inner join course c on e.course_no= c.course_no inner join student s on s.sid=e.sid
where e.grade != 'W' and e.grade != '-' group by sid) as t group by t.ent_year`,
    (err, rows) => {
      if (err) {
        return next(err);
      }
      result = []
      for (var row in rows) {
        result.push(Math.floor(rows[row].gpax*100)/100)
      }
      res.send(result)
    }
  );
});

router.get('/count', function(req, res) {
  db.query(
    `select count(*) as count from student`,
    (err, rows) => {
      if (err) {
        return next(err);
      }
      res.send(rows[0])
    }
  );
})

router.get('/left', function(req, res) {
  db.query(
    `select count(*) as leftt from student where ent_year < 2013`,
    (err, rows) => {
      if (err) {
        return next(err);
      }
      res.send(rows[0])
    }
  );
})

router.get('/award', function(req, res) {
  db.query(
    `SELECT count(*) as award FROM student_activity_awarded;`,
    (err, rows) => {
      if (err) {
        return next(err);
      }
      res.send(rows[0])
    }
  );
})

router.get('/group', function(req, res) {
  db.query(
    `select count(*) as count from student group by ent_year`,
    (err, rows) => {
      if (err) {
        return next(err);
      }
      result = []
      for (var row in rows) {
        result.push(rows[row].count)
      }
      res.send(result)
    }
  );
})

router.get('/left_major', function(req, res) {
  db.query(
    `select count(*) as count, d.name_th from student s inner join major m on m.mid=s.mid
inner join department d on d.did=m.mid
where ent_year < 2013 group by d.did`,
    (err, rows) => {
      if (err) {
        return next(err);
      }
      result = [[],[]]
      for (var row in rows) {
        result[0].push(rows[row].count)
        result[1].push(rows[row].name_th)
      }
      res.send(result)
    }
  );
})

module.exports = router;
