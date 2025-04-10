import requiredCourses from "@/resources/coins23_required.json";
import { CourseCode, CourseName } from "./course";

export type RequiredCourse = {
  name: CourseName;
  courseCodes?: Array<CourseCode>;
  options?: Array<RequiredCourseOption>;
};

export type RequiredCourseOption = {
  name: string;
  courseCodes: Array<CourseCode>;
};

export function loadRequiredCourses(): Array<RequiredCourse> {
  return requiredCourses;
}
