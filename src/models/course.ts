import kdb from '../resources/kdb.json';

export type CourseCode = string;
export type CourseName = string;
export type CourseCredit = number;
export type CourseStandardYear = string;
export type CourseStatus = 'default' | 'take' | 'invalid';

export type Course = {
  code: CourseCode,
  name: CourseName,
  credit: CourseCredit,
  standardYear: string,

  status: CourseStatus,
};

export function loadCourses(): Array<Course> {
  return (kdb as { subject: Array<Array<string>> }).subject.map(course => ({
    code: course[0],
    name: course[1],
    credit: Number(course[3]),
    standardYear: course[4],
    status: 'default',
  }));
}

export function takeCourse(courses: Array<Course>, code: CourseCode): Array<Course> {
  const newCourses = [...courses];

  const course = newCourses.find(course => course.code == code);
  if (!course) return courses;

  course.status = toggleCourseStatus(course.status);
  if (course.status == 'invalid') return courses;

  for (let i = 0; i < newCourses.length; i++) {
    if (newCourses[i].name === course.name && newCourses[i].code != code) {
      if (course.status == 'default') {
        newCourses[i].status = 'default';
      } else if (course.status == 'take') {
        newCourses[i].status = 'invalid';
      }
    }
  }

  return newCourses;
}

export function toggleCourseStatus(status: CourseStatus): CourseStatus {
  switch (status) {
    case 'default':
      return 'take';
    case 'take':
      return 'default';
    case 'invalid':
      return 'invalid';
  }
}
