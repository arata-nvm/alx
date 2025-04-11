import kdb from "@/resources/kdb.json";

export type CourseCode = string;
export type CourseName = string;
export type CourseCredit = number;
export type CourseStandardYear = string;
export type V1CourseStatus = "default" | "take" | "invalid";

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

export function loadCourses(): Array<Course> {
  return (kdb as { subject: Array<Array<string>> }).subject.map((course) => ({
    code: course[0],
    name: course[1],
    credit: Number(course[3]),
    standardYear: course[4],
    module: course[5],
    period: course[6],
  }));
}
