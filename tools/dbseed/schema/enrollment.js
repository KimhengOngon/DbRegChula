const chance = require('chance')();
const moment = require('moment');
const BaseTable = require('./base-table');
const enrollSchedule = require('../schedule_enroll.json');

class EnrollmentTable extends BaseTable {
  constructor() {
    super('enrollment', [
      'eid',
      'created_time',
      'grade',
      'edited_time',
      'course_no',
      'sid',
      'semester',
      'year'
    ], ['course', 'student_semester_info', 'student', 'course_prerequisite']);
  }

  generateMockData() {
    // Assume that we are currently in semester 2 in academic year 2016

    const prerequisiteData = super.getDepTable('course_prerequisite').getData();
    const courseData = super.getDepTable('course').getData();

    this.courseDifficulty = new Map();
    for (const course of courseData) {
      this.courseDifficulty.set(course, chance.normal({ mean: 2.5, dev: 0.5 }));
    }

    this.eidCounter = 1;

    for (const student of super.getDepTable('student').getData()) {
      const intelligence = chance.normal({ mean: 0, dev: 0.5 });

      let passedCourse = [];
      let awaitingCourse = [];

      // First 7 semesters, try to enroll according to the plan
      const firstYear = student.ent_year;

      for (let semesterCount = 1; semesterCount <= (2016 - firstYear + 1) * 2; semesterCount++) {
        const year = firstYear + Math.floor(semesterCount / 2 - 0.5);
        const semester = semesterCount % 2 === 1 ? 1 : 2;

        const isFinished = year === 2016 && semester === 2;

        let enrollableList;
        if (semesterCount >= 8) {
          enrollableList = [...awaitingCourse];
        } else {
          enrollableList = enrollSchedule[semesterCount - 1]
            .map(course_no => courseData.find(course => course.course_no === course_no));

          // Assume that each course has at most one prereq
          for (let i = 0; i < enrollableList.length; i++) {
            let course = enrollableList[i];
            while (true) {
              const prereq = prerequisiteData.find(prereq => prereq.course_no === course.course_no);
              if (!prereq) {
                // No prereq
                break;
              }
              const prereqCourseNo = prereq.pre_course_no;
              const prereqCourse = courseData.find(course => course.course_no === prereqCourseNo);
              if (passedCourse.find(c => c === prereqCourse)) {
                // Already passed the prereq course
                break;
              } else {
                course = prereqCourse;
              }
            }
            enrollableList[i] = course;
          }
        }

        if (enrollableList.length > 5) {
          enrollableList = chance.pickset(enrollableList, 5);
        }

        for (const course of enrollableList) {
          const index = awaitingCourse.indexOf(course);
          if (index !== -1) {
            awaitingCourse.splice(index);
          }
        }

        for (const enrollingCourse of enrollableList) {
          const isPass = this.tryToEnrollCourse(
            enrollingCourse,
            student,
            intelligence,
            year,
            semester,
            isFinished
          );
          if (isPass) {
            passedCourse.push(enrollingCourse);
          } else {
            awaitingCourse.push(enrollingCourse);
          }
        }

      }
    }
  }

  getNextEID() {
    const eid = this.eidCounter;
    this.eidCounter++;
    return eid;
  }

  tryToEnrollCourse(course, student, intelligence, year, semester, isNotFinishedYet) {
    const enrollDate = moment([year, semester * 6 - 1, 15])
      .add(2, 'months')
      .add(8 + Math.random() * 60, 'hours')
      .toDate();

    if (isNotFinishedYet) {
      super.putData({
        eid: this.getNextEID(),
        created_time: enrollDate,
        edited_time: enrollDate,
        grade: '-',
        course_no: course.course_no,
        sid: student.sid,
        semester: semester,
        year: year
      });
      return false;
    }

    const courseDifficulty = this.courseDifficulty.get(course);
    const randomness = chance.normal({ mean: 0, dev: 0.5 });
    const grade = courseDifficulty + intelligence + randomness;
    let gradeChar = this.mapToGrade(grade);

    if (grade < 1.5 && Math.random() < 0.5) {
      gradeChar = 'W';
    }

    super.putData({
      eid: this.getNextEID(),
      created_time: enrollDate,
      edited_time: enrollDate,
      grade: gradeChar,
      course_no: course.course_no,
      sid: student.sid,
      semester: semester,
      year: year
    });

    return gradeChar !== 'W' && gradeChar !== 'F';
  }

  mapToGrade(g) {
    if (g >= 4.0) {
      return 'A';
    } else if (g >= 3.5) {
      return 'B+';
    } else if (g >= 3.0) {
      return 'B';
    } else if (g >= 2.5) {
      return 'C+';
    } else if (g >= 2.0) {
      return 'C';
    } else if (g >= 1.5) {
      return 'D+';
    } else if (g >= 1.0) {
      return 'D';
    } else {
      return 'F';
    }
  }
}


module.exports = EnrollmentTable;

