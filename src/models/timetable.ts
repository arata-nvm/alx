import { Course, CourseCode } from "./course";
import { CourseViewItem } from "./courseView";
import {
  getSelectedCourseTag,
  isInterested,
  SelectedCourses,
} from "./selectedCourse";

export type TimetableViewItem = Map<
  CourseDay,
  Map<CoursePeriod, Array<CourseViewItem>>
>;

export type TimetableViewItems = {
  springA: TimetableViewItem;
  springB: TimetableViewItem;
  springC: TimetableViewItem;
  fallA: TimetableViewItem;
  fallB: TimetableViewItem;
  fallC: TimetableViewItem;
  others: Array<CourseViewItem>;
};

export function sortTimetableViewItems(
  courses: Array<Course>,
  selected: SelectedCourses,
): TimetableViewItems {
  const interested = courses.filter((course) =>
    isInterested(selected, course.code),
  );

  const collected: Set<CourseCode> = new Set();

  const items = {
    springA: sortTimetableViewItem(interested, selected, collected, "春", "A"),
    springB: sortTimetableViewItem(interested, selected, collected, "春", "B"),
    springC: sortTimetableViewItem(interested, selected, collected, "春", "C"),
    fallA: sortTimetableViewItem(interested, selected, collected, "秋", "A"),
    fallB: sortTimetableViewItem(interested, selected, collected, "秋", "B"),
    fallC: sortTimetableViewItem(interested, selected, collected, "秋", "C"),
    others: interested
      .filter((course) => !collected.has(course.code))
      .map((course) => ({
        ...course,
        tag: getSelectedCourseTag(selected, course.code),
      })),
  };

  return items;
}

function sortTimetableViewItem(
  intetested: Array<Course>,
  selectedCourses: SelectedCourses,
  collected: Set<CourseCode>,
  semester: CourseSemester,
  module: CourseModule,
): TimetableViewItem {
  const item = new Map();
  const coursesInModule = intetested.filter((course) =>
    isCourseInModule(course, semester, module),
  );
  for (const day of courseDayValues) {
    const dayItem = new Map();
    for (const period of coursePeriodValues) {
      const coursesInWeekday = coursesInModule
        .filter((course) => isCourseInPeriod(course, day, period))
        .map((course) => ({
          ...course,
          tag: getSelectedCourseTag(selectedCourses, course.code),
        }));
      coursesInWeekday.forEach((course) => collected.add(course.code));
      dayItem.set(period, coursesInWeekday);
    }
    item.set(day, dayItem);
  }
  return item;
}

export type CourseSemester = "春" | "秋";
export const courseSemesterValues: Array<CourseSemester> = ["春", "秋"];

export type CourseModule = "A" | "B" | "C";
export const courseModuleValues: Array<CourseModule> = ["A", "B", "C"];

function isCourseInModule(
  course: Course,
  semester: CourseSemester,
  module: CourseModule,
): boolean {
  return course.module.includes(semester) && course.module.includes(module);
}

export type CourseDay = "月" | "火" | "水" | "木" | "金";
export const courseDayValues: Array<CourseDay> = ["月", "火", "水", "木", "金"];

export type CoursePeriod = "1" | "2" | "3" | "4" | "5" | "6";
export const coursePeriodValues: Array<CoursePeriod> = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
];

function isCourseInPeriod(
  course: Course,
  day: CourseDay,
  period: CoursePeriod,
): boolean {
  let match: RegExpExecArray | null;

  // 月3
  match = /^([月火水木金])(\d)$/.exec(course.period);
  if (match) {
    const [, dayStr, periodStr] = match;
    return day === dayStr && period === periodStr;
  }

  // 木3,4
  match = /^([月火水木金])(\d),(\d)$/.exec(course.period);
  if (match) {
    const [, dayStr, period1Str, period2Str] = match;
    return day === dayStr && (period === period1Str || period === period2Str);
  }

  // 月6-8
  match = /^([月火水木金])(\d)-(\d)$/.exec(course.period);
  if (match) {
    const [, dayStr, period1Str, period2Str] = match;
    const periodStart = parseInt(period1Str, 10);
    if (Number.isNaN(periodStart)) return false;
    const periodEnd = parseInt(period2Str, 10);
    if (Number.isNaN(periodEnd)) return false;
    const periodInt = parseInt(period, 10);
    return day === dayStr && periodStart <= periodInt && periodInt <= periodEnd;
  }

  // 火・金3,4
  match = /^([月火水木金])・([月火水木金])(\d),(\d)$/.exec(course.period);
  if (match) {
    const [, day1Str, day2Str, period1Str, period2Str] = match;
    return (
      (day === day1Str || day === day2Str) &&
      (period === period1Str || period === period2Str)
    );
  }

  // 水3,4,金5,6
  match = /^([月火水木金])(\d),(\d),([月火水木金])(\d),(\d)$/.exec(
    course.period,
  );
  if (match) {
    const [
      ,
      day1Str,
      period11Str,
      period12Str,
      day2Str,
      period21Str,
      period22Str,
    ] = match;
    return (
      (day === day1Str && (period === period11Str || period === period12Str)) ||
      (day === day2Str && (period === period21Str || period === period22Str))
    );
  }

  // 火1,2 金5,6
  match = /^([月火水木金])(\d),(\d) ([月火水木金])(\d),(\d)$/.exec(
    course.period,
  );
  if (match) {
    const [
      ,
      day1Str,
      period11Str,
      period12Str,
      day2Str,
      period21Str,
      period22Str,
    ] = match;
    return (
      (day === day1Str && (period === period11Str || period === period12Str)) ||
      (day === day2Str && (period === period21Str || period === period22Str))
    );
  }

  // 月3-5 月3,4
  match = /^([月火水木金])(\d)-(\d) ([月火水木金])(\d),(\d)$/.exec(
    course.period,
  );
  if (match) {
    const [
      ,
      day1Str,
      period11Str,
      period12Str,
      day2Str,
      period21Str,
      period22Str,
    ] = match;
    const periodStart = parseInt(period11Str, 10);
    if (Number.isNaN(periodStart)) return false;
    const periodEnd = parseInt(period12Str, 10);
    if (Number.isNaN(periodEnd)) return false;
    const periodInt = parseInt(period, 10);
    return (
      (day === day1Str && periodStart <= periodInt && periodInt <= periodEnd) ||
      (day === day2Str && (period === period21Str || period === period22Str))
    );
  }

  // 金3 金4
  match = /^([月火水木金])(\d) ([月火水木金])(\d)$/.exec(course.period);
  if (match) {
    const [, day1Str, period1Str, day2Str, period2Str] = match;
    return (
      (day === day1Str && period === period1Str) ||
      (day === day2Str && period === period2Str)
    );
  }

  return false;
}
