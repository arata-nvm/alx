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
  return getCourseModuleKeys(course).has(`${semester}${module}`);
}

function getCourseModuleKeys(course: Course): Set<string> {
  const keys = new Set<string>();
  const normalized = course.module.replace(/\s+/g, "");
  for (const match of normalized.matchAll(/(春|秋)(ABC|AB|BC|A|B|C|学期)/g)) {
    const semester = match[1] as CourseSemester;
    const modules =
      match[2] === "学期"
        ? courseModuleValues
        : (match[2].split("") as Array<CourseModule>);
    for (const module of modules) {
      keys.add(`${semester}${module}`);
    }
  }
  return keys;
}

export type CourseDay = "月" | "火" | "水" | "木" | "金" | "土";
export const courseDayValues: Array<CourseDay> = [
  "月",
  "火",
  "水",
  "木",
  "金",
  "土",
];

export type CoursePeriod = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export const coursePeriodValues: Array<CoursePeriod> = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
];

function isCourseInPeriod(
  course: Course,
  day: CourseDay,
  period: CoursePeriod,
): boolean {
  return course.period
    .split(/\s*\n\s*/)
    .map((value) => value.trim())
    .filter(Boolean)
    .some((value) => isCourseInPeriodValue(value, day, period));
}

function isCourseInPeriodValue(
  coursePeriod: string,
  day: CourseDay,
  period: CoursePeriod,
): boolean {
  let match: RegExpExecArray | null;

  // 月3
  match = /^([月火水木金土])(\d)$/.exec(coursePeriod);
  if (match) {
    const [, dayStr, periodStr] = match;
    return day === dayStr && period === periodStr;
  }

  // 木3,4
  match = /^([月火水木金土])(\d),(\d)$/.exec(coursePeriod);
  if (match) {
    const [, dayStr, period1Str, period2Str] = match;
    return day === dayStr && (period === period1Str || period === period2Str);
  }

  // 月6-8
  match = /^([月火水木金土])(\d)-(\d)$/.exec(coursePeriod);
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
  match = /^([月火水木金土])・([月火水木金土])(\d),(\d)$/.exec(coursePeriod);
  if (match) {
    const [, day1Str, day2Str, period1Str, period2Str] = match;
    return (
      (day === day1Str || day === day2Str) &&
      (period === period1Str || period === period2Str)
    );
  }

  // 水3,4,金5,6
  match = /^([月火水木金土])(\d),(\d),([月火水木金土])(\d),(\d)$/.exec(
    coursePeriod,
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
  match = /^([月火水木金土])(\d),(\d) ([月火水木金土])(\d),(\d)$/.exec(
    coursePeriod,
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
  match = /^([月火水木金土])(\d)-(\d) ([月火水木金土])(\d),(\d)$/.exec(
    coursePeriod,
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
  match = /^([月火水木金土])(\d) ([月火水木金土])(\d)$/.exec(coursePeriod);
  if (match) {
    const [, day1Str, period1Str, day2Str, period2Str] = match;
    return (
      (day === day1Str && period === period1Str) ||
      (day === day2Str && period === period2Str)
    );
  }

  return false;
}

export type CourseTimeSlot = {
  semester: CourseSemester;
  module: CourseModule;
  day: CourseDay;
  period: CoursePeriod;
};

export function getCourseTimeSlots(course: Course): Array<CourseTimeSlot> {
  const slots: Array<CourseTimeSlot> = [];
  for (const semester of courseSemesterValues) {
    for (const module of courseModuleValues) {
      if (!isCourseInModule(course, semester, module)) continue;
      for (const day of courseDayValues) {
        for (const period of coursePeriodValues) {
          if (!isCourseInPeriod(course, day, period)) continue;
          slots.push({ semester, module, day, period });
        }
      }
    }
  }
  return slots;
}

function toSlotKey(slot: CourseTimeSlot): string {
  return `${slot.semester}${slot.module}-${slot.day}${slot.period}`;
}

export function getPlannedCourseConflicts(
  courses: Array<Course>,
  selectedCourses: SelectedCourses,
): Map<CourseCode, Array<Course>> {
  const courseByCode = new Map(courses.map((course) => [course.code, course]));
  const plannedCourses = Array.from(selectedCourses.values())
    .filter((course) => course.tag === "planned")
    .map((course) => courseByCode.get(course.code))
    .filter((course): course is Course => Boolean(course));

  const slotToPlannedCourses = new Map<string, Map<CourseCode, Course>>();
  for (const course of plannedCourses) {
    for (const slot of getCourseTimeSlots(course)) {
      const key = toSlotKey(slot);
      const existing = slotToPlannedCourses.get(key) ?? new Map();
      existing.set(course.code, course);
      slotToPlannedCourses.set(key, existing);
    }
  }

  const conflictCourses = new Map<CourseCode, Map<CourseCode, Course>>();
  for (const course of courses) {
    for (const slot of getCourseTimeSlots(course)) {
      const plannedAtSlot = slotToPlannedCourses.get(toSlotKey(slot));
      if (!plannedAtSlot) continue;
      for (const [plannedCode, plannedCourse] of plannedAtSlot.entries()) {
        if (plannedCode === course.code) continue;
        const existing = conflictCourses.get(course.code) ?? new Map();
        existing.set(plannedCode, plannedCourse);
        conflictCourses.set(course.code, existing);
      }
    }
  }

  const results = new Map<CourseCode, Array<Course>>();
  for (const [code, conflictMap] of conflictCourses.entries()) {
    results.set(code, Array.from(conflictMap.values()));
  }
  return results;
}
