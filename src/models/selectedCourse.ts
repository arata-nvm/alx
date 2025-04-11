import { Course, CourseCode, CourseCredit, CourseName } from "./course";

export type CourseTag = "enrolled" | "planned" | "considering" | "declined";
export const courseTagValues: CourseTag[] = [
  "enrolled",
  "planned",
  "considering",
  "declined",
];

export function isTagTaking(tag: CourseTag): boolean {
  return tag === "enrolled" || tag === "planned";
}

export function isTagInterested(tag: CourseTag): boolean {
  return tag === "enrolled" || tag === "planned" || tag === "considering";
}

export type SelectedCourse = {
  code: CourseCode;
  name: CourseName;
  credit: CourseCredit;
  tag: CourseTag;
};
export type SelectedCourses = Map<CourseCode, SelectedCourse>;

export function newSelectedCourses(): SelectedCourses {
  return new Map();
}

export function cloneSelectedCourses(
  selectedCourses: SelectedCourses,
): SelectedCourses {
  return new Map(selectedCourses);
}

export function setSelectedCourse(
  selectedCourses: SelectedCourses,
  course: Course | SelectedCourse,
  tag: CourseTag,
): SelectedCourses {
  if (tag === "declined") {
    return deleteSelectedCourse(selectedCourses, course.code);
  }

  const newSelectedCourses = new Map(selectedCourses);
  newSelectedCourses.set(course.code, {
    code: course.code,
    name: course.name,
    credit: course.credit,
    tag,
  });
  return newSelectedCourses;
}

export function setSelectedCourseRaw(
  selectedCourses: SelectedCourses,
  course: SelectedCourse,
): SelectedCourses {
  const newSelectedCourses = new Map(selectedCourses);
  newSelectedCourses.set(course.code, course);
  return newSelectedCourses;
}

export function deleteSelectedCourse(
  selectedCourses: SelectedCourses,
  courseCode: CourseCode,
): SelectedCourses {
  const newSelectedCourses = new Map(selectedCourses);
  newSelectedCourses.delete(courseCode);
  return newSelectedCourses;
}

export function getSelectedCourseTag(
  selectedCourses: SelectedCourses,
  courseCode: CourseCode,
): CourseTag {
  const course = selectedCourses.get(courseCode);
  if (!course) return "declined";
  return course.tag;
}

export function isTaking(
  selectedCourses: SelectedCourses,
  courseCode: CourseCode,
): boolean {
  const course = selectedCourses.get(courseCode);
  if (!course) return false;
  return isTagTaking(course.tag);
}

export function isInterested(
  selectedCourses: SelectedCourses,
  courseCode: CourseCode,
): boolean {
  const course = selectedCourses.get(courseCode);
  if (!course) return false;
  return isTagInterested(course.tag);
}

export function takingCourse(
  selectedCourses: SelectedCourses,
): Array<SelectedCourse> {
  return Array.from(selectedCourses.values()).filter((course) =>
    isTaking(selectedCourses, course.code),
  );
}

export function interestedCourses(
  selectedCourses: SelectedCourses,
): Array<SelectedCourse> {
  return Array.from(selectedCourses.values()).filter((course) =>
    isInterested(selectedCourses, course.code),
  );
}

export function countCreditCoursesByTag(
  selectedCourses: SelectedCourses,
  tag: CourseTag,
): number {
  return Array.from(selectedCourses.values())
    .filter((course) => course.tag === tag)
    .map((course) => course.credit)
    .reduce((acc, credit) => acc + credit, 0);
}
