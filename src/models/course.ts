import kdb from "@/resources/kdb2026.json";

export type CourseCode = string;
export type CourseName = string;
export type CourseCredit = number;
export type CourseStandardYear = string;
export type V1CourseStatus = "default" | "take" | "invalid";

type KdbCourse = {
  科目番号: CourseCode;
  科目名: CourseName;
  単位数: string;
  標準履修年次: CourseStandardYear;
  実施学期: string;
  曜時限: string;
};

export type Course = {
  code: CourseCode;
  name: CourseName;
  credit: CourseCredit;
  standardYear: string;
  module: string;
  period: string;
};

export type V1Course = {
  code: CourseCode;
  name: CourseName;
  credit: CourseCredit;
  standardYear: string;
  module: string;
  period: string;
  status: V1CourseStatus;
};

const courses: Array<Course> = (kdb as Array<KdbCourse>).map((course) => ({
  code: course.科目番号,
  name: course.科目名,
  credit: Number(course.単位数),
  standardYear: course.標準履修年次,
  module: course.実施学期,
  period: course.曜時限,
}));

export function loadCourses(): Array<Course> {
  return courses;
}
