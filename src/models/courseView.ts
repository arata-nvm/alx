import courseViewFilters from "@/resources/coins23_view.json";
import { Course, CourseCode, CourseName } from "./course";
import {
  CourseTag,
  getSelectedCourseTag,
  isTaking,
  SelectedCourses,
  takingCourse,
} from "./selectedCourse";

type CourseViewFilter = {
  name: CourseName;
  isDisabled?: boolean;
  courseList?: Array<CourseCode>;
  courseFilter?: string;
  children?: Array<CourseViewFilter>;
};

function loadCourseViewFilters(): Array<CourseViewFilter> {
  return courseViewFilters;
}

export type CourseViewTab = {
  name: CourseName;
  isDisabled: boolean;
  items: Array<CourseViewItem>;
  children: Array<CourseViewTab>;
};

export type CourseViewItemTag = CourseTag | "ineligible";

export type CourseViewItem = Course & {
  tag: CourseViewItemTag;
};

export function getCourseViewTabs(
  courses: Array<Course>,
  selectedCourses: SelectedCourses,
): Array<CourseViewTab> {
  const filters = loadCourseViewFilters();
  const collectedCourses: CourseCode[] = [];

  const takenCourseNames = new Set(
    takingCourse(selectedCourses).map((course) => course.name),
  );

  const items: CourseViewTab[] = [];
  for (const filter of filters) {
    items.push(
      doGetCourseViewTabs(
        courses,
        selectedCourses,
        filter,
        collectedCourses,
        takenCourseNames,
      ),
    );
  }

  const otherItems = courses
    .filter((course) => !collectedCourses.includes(course.code))
    .map((course) => ({
      ...course,
      tag: getSelectedCourseTag(selectedCourses, course.code),
    }));

  items.push({
    name: "その他",
    isDisabled: false,
    items: otherItems,
    children: [],
  });

  return items;
}

function doGetCourseViewTabs(
  courses: Array<Course>,
  selectedCourses: SelectedCourses,
  filter: CourseViewFilter,
  collectedCourses: CourseCode[],
  takenCourseNames: Set<string>,
): CourseViewTab {
  const addCourseViewItem = (course: Course) => {
    if (collectedCourses.includes(course.code)) return;

    let tag: CourseViewItemTag = getSelectedCourseTag(
      selectedCourses,
      course.code,
    );
    if (
      !isTaking(selectedCourses, course.code) &&
      takenCourseNames.has(course.name)
    ) {
      tag = "ineligible";
    }
    items.push({ ...course, tag: tag });
    collectedCourses.push(course.code);
  };

  const items: CourseViewItem[] = [];
  if (filter.courseList !== undefined) {
    for (const course of courses) {
      if (!filter.courseList.includes(course.code)) continue;
      addCourseViewItem(course);
    }
  }

  if (filter.courseFilter !== undefined) {
    const regex = new RegExp(filter.courseFilter);
    for (const course of courses) {
      if (!regex.test(course.code)) continue;
      addCourseViewItem(course);
    }
  }

  const children = filter.children?.map((child) =>
    doGetCourseViewTabs(
      courses,
      selectedCourses,
      child,
      collectedCourses,
      takenCourseNames,
    ),
  );

  return {
    name: filter.name,
    isDisabled: filter.isDisabled ?? false,
    items,
    children: children ?? [],
  };
}
