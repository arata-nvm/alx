import { CourseCode } from "./course";

export type CourseTag = "default" | "take";
export type CourseTags = Map<CourseCode, CourseTag>;

export function toggleCourseTag(
  courseTags: CourseTags,
  code: CourseCode,
): CourseTags {
  const tag = courseTags.get(code);
  if (tag) {
    return deleteCourseTag(courseTags, code);
  } else {
    return setCourseTag(courseTags, code, "take");
  }
}

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
  return courseTags.get(code) ?? "default";
}
