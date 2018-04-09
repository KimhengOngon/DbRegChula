node ./gen-table-class.js Activity activity aid name start_date duration > ./schema/activity.js
node ./gen-table-class.js Faculty faculty fid name_th name_en > ./schema/faculty.js
node ./gen-table-class.js Department department did name_th name_en fid > ./schema/department.js
node ./gen-table-class.js Major major mid name_en name_th did required_lang required_approve > ./schema/major.js
node ./gen-table-class.js Student student sid fname_th fname_en lname_th lname_en initial_name address_en address_th ent_year behav_score mid > ./schema/student.js
node ./gen-table-class.js StudentActivityAwarded student_activity_awarded sid aid award > ./schema/student-activity-awarded.js
node ./gen-table-class.js StudentActivityJoin student_activity_join sid aid > ./schema/student-activity-join.js
node ./gen-table-class.js AbsentRecord absent_record arid start_date end_date name description > ./schema/absent-record.js
node ./gen-table-class.js AbsentRecordHasStudent absent_record_has_student arid sid > ./schema/absent-record-has-student.js
node ./gen-table-class.js Course course course_no name_en name_th shortname credit subcredit_1 subcredit_2 subcredit_3 special_type did > ./schema/course.js
node ./gen-table-class.js CoursePrerequisite course_prerequisite course_no pre_course_no > ./schema/course-prerequisite.js
node ./gen-table-class.js MajorCourseRequired major_course_required mid course_no > ./schema/major-course-required.js
node ./gen-table-class.js StudentSemesterInfo student_semester_info sid semester year > ./schema/student-semester-info.js
node ./gen-table-class.js Enrollment enrollment eid created_time grade edited_time course_no sid semester year > ./schema/enrollment.js
node ./gen-table-class.js User user id password display_name type > ./schema/user.js
node ./gen-table-class.js UserStudentAdvice user_student_advice user_id student_sid > ./schema/user-student-advice.js
