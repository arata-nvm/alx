import {
  CourseTag,
  getSelectedCourseTag,
  SelectedCourses,
  setSelectedCourseRaw,
} from "./selectedCourse";

export interface ImportResult {
  selectedCourses: SelectedCourses;
  importedCourses: string[];
  failedCourses: string[];
}

export function importFromTwins(
  text: string,
  selectedCourses: SelectedCourses,
): ImportResult {
  const data = csvToArray(text);

  let newSelectedCourses = selectedCourses;
  const importedCourses: string[] = [];
  data.forEach((row) => {
    if (row.length < 8) return;
    const courseCode = row[2];
    const courseName = row[3];
    const courseCredit = parseFloat(row[4]);
    const courseGrade = row[7];

    if (courseCode.trim() === "") return;

    let tag: CourseTag;
    if (["P", "A+", "A", "B", "C", "認"].includes(courseGrade)) {
      tag = "enrolled";
    } else if (["履修中", "D", "F"].includes(courseGrade)) {
      tag = "planned";
    } else {
      return;
    }

    if (getSelectedCourseTag(newSelectedCourses, courseCode) == "enrolled")
      return;

    newSelectedCourses = setSelectedCourseRaw(newSelectedCourses, {
      code: courseCode,
      name: courseName,
      credit: courseCredit,
      tag,
    });
    importedCourses.push(courseName);
  });

  return {
    selectedCourses: newSelectedCourses,
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
