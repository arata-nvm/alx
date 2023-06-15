import requiredCourses from '../resources/coins23_required.json';
import { CourseCode, CourseName } from "./course";

export interface RequiredCourse {
  name: CourseName,
  courseCodes?: Array<CourseCode>,
  options?: Array<RequiredCourseOption>,
}

export interface RequiredCourseOption {
  name: string,
  courseCodes: Array<CourseCode>,
}

export function loadRequiredCourses(): Array<RequiredCourse> {
  return requiredCourses;
}
