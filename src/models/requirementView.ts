import requirement from "@/resources/coins23_requirement.json";
import { CourseCode, CourseCredit } from "./course";
import {
  interestedCourses,
  isTagTaking,
  SelectedCourse,
  SelectedCourses,
} from "./selectedCourse";

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
  creditedCourses: Array<SelectedCourse>;
  children: Array<RequirementStatus>;
};

export function loadRequirementViewItem(): RequirementViewItem {
  return requirement;
}

export function inquiryRequirementStatus(
  item: RequirementViewItem,
  selectedCourses: SelectedCourses,
): RequirementStatus {
  return doInquiryRequirementStatus(
    item,
    selectedCourses,
    interestedCourses(selectedCourses),
    new Set(),
  );
}

function doInquiryRequirementStatus(
  item: RequirementViewItem,
  selectedCourses: SelectedCourses,
  interestedCourses: SelectedCourse[],
  consumedCourses: Set<CourseCode>,
): RequirementStatus {
  let totalCredit = 0;
  const creditedCourses = [];

  const collectedCourses = collectCourses(
    item,
    interestedCourses,
    consumedCourses,
  );
  for (const course of collectedCourses) {
    if (!consumedCourses.has(course.code) && isTagTaking(course.tag)) {
      totalCredit += course.credit;
    }
    creditedCourses.push(course);
    consumedCourses.add(course.code);
  }

  let totalClampedCredit = totalCredit;

  const children = [];
  if (item.children) {
    for (const child of item.children) {
      const status = doInquiryRequirementStatus(
        child,
        selectedCourses,
        interestedCourses,
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

function collectCourses(
  item: RequirementViewItem,
  interestedCourses: SelectedCourse[],
  consumedCourses: Set<CourseCode>,
): Array<SelectedCourse> {
  const collected = [];

  if (item.courseList) {
    collected.push(
      ...interestedCourses.filter(
        (course) =>
          item.courseList?.indexOf(course.code) != -1 &&
          !consumedCourses.has(course.code),
      ),
    );
  }

  if (item.courseFilter) {
    const regex = new RegExp(item.courseFilter);
    collected.push(
      ...interestedCourses.filter(
        (course) =>
          regex.test(course.code) && !consumedCourses.has(course.code),
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
