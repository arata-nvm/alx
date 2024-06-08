import courseViewItems from '../resources/coins23_view.json';
import { Course, CourseCode, CourseName } from './course';

export type CourseViewItem = {
  name: CourseName,
  isDisabled?: boolean,
  courseList?: Array<CourseCode>,
  courseFilter?: string,
  children?: Array<CourseViewItem>,
};

export function loadCourseViewItems(): Array<CourseViewItem> {
  return courseViewItems
}

export function collectCoursesFromCourseView(courses: Array<Course>, item: CourseViewItem): Array<Course> {
  const collected = [];

  if (item.courseList !== undefined) {
    collected.push(...courses.filter(course => item.courseList?.indexOf(course.code) != -1));
  }

  if (item.courseFilter !== undefined) {
    const regex = new RegExp(item.courseFilter);
    collected.push(...courses.filter(course => regex.test(course.code)));
  }

  return collected;
}
