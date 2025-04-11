import { CourseTag, CourseTags, setCourseTag } from "./courseTag";

export interface ImportResult {
  courseTags: CourseTags;
  importedCourses: string[];
  failedCourses: string[];
}

export function importFromTwins(
  text: string,
  courseTags: CourseTags,
): ImportResult {
  const data = csvToArray(text);

  let newCourseTags = courseTags;
  const importedCourses: string[] = [];
  data.forEach((row) => {
    if (row.length < 8) return;
    const courseCode = row[2];
    const courseName = row[3];
    const courseGrade = row[7];

    if (courseCode.trim() === "") return;

    let tag: CourseTag;
    if (["P", "A+", "A", "B", "C", "認"].includes(courseGrade)) {
      tag = "enrolled";
    } else if (["履修中", "D"].includes(courseGrade)) {
      tag = "planned";
    } else {
      return;
    }

    newCourseTags = setCourseTag(newCourseTags, courseCode, tag);
    importedCourses.push(courseName);
  });

  return {
    courseTags: newCourseTags,
    importedCourses: importedCourses,
    failedCourses: data
      .map((row) => row[3])
      .filter((courseName) => !importedCourses.includes(courseName)),
  };
}

function csvToArray(text: string): string[][] {
  const lines = text.split("\n");
  const data = lines
    .filter((line) => line.trim() !== "")
    .map((line) => line.replace(/^"/, "").replace(/"$/, "").split('","'));
  return data.slice(1);
}
