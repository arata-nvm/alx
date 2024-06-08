import requirement from '../resources/coins23_requirement.json';
import { Course, CourseCode, CourseCredit } from './course';

export type RequirementViewItem = {
  name: string,
  creditRange: CourseCreditRange,
  courseList?: Array<CourseCode>,
  courseFilter?: string,
  children?: Array<RequirementViewItem>,
};

export type CourseCreditRange = {
  min: CourseCredit,
  max?: CourseCredit,
};

export type RequirementStatus = {
  name: string,
  credit: CourseCredit,
  clampedCredit: CourseCredit,
  creditRange: CourseCreditRange,
  courseNames: Array<string>,
  children: Array<RequirementStatus>,
};

export function loadRequirementViewItem(): RequirementViewItem {
  return requirement;
}

export function inquiryRequirementStatus(item: RequirementViewItem, courses: Array<Course>, consumedCourses?: Set<CourseCode>): RequirementStatus {
  if (!consumedCourses) consumedCourses = new Set();

  let totalCredit = 0;
  const courseNames = [];

  const collectedCourses = collectCourses(item, courses, consumedCourses);
  for (const course of collectedCourses) {
    totalCredit += course.credit;
    courseNames.push(course.name);
    consumedCourses.add(course.code);
  }

  courses = courses.filter(course1 => collectedCourses.findIndex(course2 => course2.code === course1.code) == -1);

  const children = [];
  if (item.children) {
    for (const child of item.children) {
      const status = inquiryRequirementStatus(child, courses, consumedCourses)
      totalCredit += status.clampedCredit;
      children.push(status);
    }
  }

  return {
    name: item.name,
    courseNames,
    credit: totalCredit,
    clampedCredit: clampCourseCredit(totalCredit, item.creditRange),
    creditRange: item.creditRange,
    children,
  };
}

export function collectCourses(item: RequirementViewItem, courses: Array<Course>, consumedCourses: Set<CourseCode>): Array<Course> {
  const collected = [];

  if (item.courseList) {
    collected.push(...courses.filter(course => course.status == 'take' && item.courseList?.indexOf(course.code) != -1 && !consumedCourses.has(course.code)));
  }

  if (item.courseFilter) {
    const regex = new RegExp(item.courseFilter);
    collected.push(...courses.filter(course => course.status == 'take' && regex.test(course.code) && !consumedCourses.has(course.code)));
  }

  return collected;
}

function clampCourseCredit(credit: CourseCredit, range: CourseCreditRange): CourseCredit {
  if (range.max !== undefined) {
    return Math.min(credit, range.max);
  } else {
    return credit;
  }
}
