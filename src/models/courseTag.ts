import { CourseCode } from "./course";

export type CourseTag = "enrolled" | "planned" | "considering" | "declined";
export type CourseTags = Map<CourseCode, CourseTag>;

export const courseTagValues: CourseTag[] = [
  "enrolled",
  "planned",
  "considering",
  "declined",
];

export function setCourseTag(
  _courseTags: CourseTags,
  code: CourseCode,
  tag: CourseTag,
): CourseTags {
  const courseTags = new Map(_courseTags);
  courseTags.set(code, tag);
  return courseTags;
}

export function deleteCourseTag(
  _courseTags: CourseTags,
  code: CourseCode,
): CourseTags {
  const courseTags = new Map(_courseTags);
  courseTags.delete(code);
  return courseTags;
}

export function getCourseTag(
  courseTags: CourseTags,
  code: CourseCode,
): CourseTag {
  return courseTags.get(code) ?? "declined";
}

export function isTaking(courseTags: CourseTags, code: CourseCode): boolean {
  const tag = getCourseTag(courseTags, code);
  return tag === "enrolled" || tag === "planned";
}
