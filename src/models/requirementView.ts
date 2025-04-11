import requirement from "@/resources/coins23_requirement.json";
import { Course, CourseCode, CourseCredit } from "./course";
import { CourseTags, isInterested, isTaking } from "./courseTag";

export type RequirementViewItem = {
  name: string;
  creditRange: CourseCreditRange;
  courseList?: Array<CourseCode>;
  courseFilter?: string;
  children?: Array<RequirementViewItem>;
};

export type CourseCreditRange = {
  min: CourseCredit;
  max?: CourseCredit;
};

export type RequirementStatus = {
  name: string;
  credit: CourseCredit;
  clampedCredit: CourseCredit;
  creditRange: CourseCreditRange;
  creditedCourses: Array<Course>;
  children: Array<RequirementStatus>;
};

export function loadRequirementViewItem(): RequirementViewItem {
  return requirement;
}

export function inquiryRequirementStatus(
  item: RequirementViewItem,
  courses: Array<Course>,
  courseTags: CourseTags,
  consumedCourses?: Set<CourseCode>,
): RequirementStatus {
  if (!consumedCourses) consumedCourses = new Set();

  let totalCredit = 0;
  const creditedCourses = [];

  const collectedCourses = collectCourses(
    item,
    courses,
    courseTags,
    consumedCourses,
  );
  for (const course of collectedCourses) {
    if (isTaking(courseTags, course.code)) {
      totalCredit += course.credit;
    }
    creditedCourses.push(course);
    consumedCourses.add(course.code);
  }

  let totalClampedCredit = totalCredit;
  courses = courses.filter(
    (course1) =>
      collectedCourses.findIndex((course2) => course2.code === course1.code) ==
      -1,
  );

  const children = [];
  if (item.children) {
    for (const child of item.children) {
      const status = inquiryRequirementStatus(
        child,
        courses,
        courseTags,
        consumedCourses,
      );
      totalCredit += status.credit;
      totalClampedCredit += status.clampedCredit;
      children.push(status);
    }
  }

  return {
    name: item.name,
    creditedCourses,
    credit: totalCredit,
    clampedCredit: clampCourseCredit(totalClampedCredit, item.creditRange),
    creditRange: item.creditRange,
    children,
  };
}

export function collectCourses(
  item: RequirementViewItem,
  courses: Array<Course>,
  courseTags: CourseTags,
  consumedCourses: Set<CourseCode>,
): Array<Course> {
  const collected = [];

  if (item.courseList) {
    collected.push(
      ...courses.filter(
        (course) =>
          isInterested(courseTags, course.code) &&
          item.courseList?.indexOf(course.code) != -1 &&
          !consumedCourses.has(course.code),
      ),
    );
  }

  if (item.courseFilter) {
    const regex = new RegExp(item.courseFilter);
    collected.push(
      ...courses.filter(
        (course) =>
          isInterested(courseTags, course.code) &&
          regex.test(course.code) &&
          !consumedCourses.has(course.code),
      ),
    );
  }

  return collected;
}

function clampCourseCredit(
  credit: CourseCredit,
  range: CourseCreditRange,
): CourseCredit {
  if (range.max !== undefined) {
    return Math.min(credit, range.max);
  } else {
    return credit;
  }
}
