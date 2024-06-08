import courseViewFilters from '../resources/coins23_view.json';
import {Course, CourseCode, CourseName} from './course';

type CourseViewFilter = {
  name: CourseName,
  isDisabled?: boolean,
  courseList?: Array<CourseCode>,
  courseFilter?: string,
  children?: Array<CourseViewFilter>,
};

function loadCourseViewFilters(): Array<CourseViewFilter> {
  return courseViewFilters
}

export type CourseViewItem = {
  name: CourseName,
  isDisabled: boolean,
  courseList: Array<Course>,
  children: Array<CourseViewItem>,
}

export function getCourseViewItems(courses: Array<Course>): Array<CourseViewItem> {
  const filters = loadCourseViewFilters();
  const collectedCourses: CourseCode[] = [];

  const items = [];
  for (const filter of filters) {
    items.push(doGetCourseViewItems(courses, filter, collectedCourses))
  }

  const otherCourses = courses.filter(course => !collectedCourses.includes(course.code));
  items.push({
    name: "その他",
    isDisabled: false,
    courseList: otherCourses,
    children: [],
  });

  return items;
}

function doGetCourseViewItems(courses: Array<Course>, filter: CourseViewFilter, collectedCourses: CourseCode[]): CourseViewItem {
  const courseList: Course[] = [];
  if (filter.courseList !== undefined) {
    for (const course of courses) {
      if (filter.courseList.includes(course.code) && !collectedCourses.includes(course.code)) {
        courseList.push(course);
        collectedCourses.push(course.code);
      }
    }
  }
  if (filter.courseFilter !== undefined) {
    const regex = new RegExp(filter.courseFilter);
    for (const course of courses) {
      if (regex.test(course.code) && !collectedCourses.includes(course.code)) {
        courseList.push(course);
        collectedCourses.push(course.code);
      }
    }
  }

  const children = filter.children?.map(child => doGetCourseViewItems(courses, child, collectedCourses));

  return {
    name: filter.name,
    isDisabled: filter.isDisabled ?? false,
    courseList,
    children: children ?? [],
  };
}
