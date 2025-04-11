import { Course, loadCourses } from "@/models/course";
import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { isTaking, SelectedCourses } from "@/models/selectedCourse";

export const TimetableView: FC<{
  selectedCourses: SelectedCourses;
}> = ({ selectedCourses }) => {
  const courses = loadCourses();
  return (
    <div className="text-left">
      <h2>春</h2>
      <h3>A</h3>
      <Timetable
        courses={courses}
        selectedCourses={selectedCourses}
        semester="春"
        module="A"
      />
      <h3>B</h3>
      <Timetable
        courses={courses}
        selectedCourses={selectedCourses}
        semester="春"
        module="B"
      />
      <h3>C</h3>
      <Timetable
        courses={courses}
        selectedCourses={selectedCourses}
        semester="春"
        module="C"
      />
      <h2>秋</h2>
      <h3>A</h3>
      <Timetable
        courses={courses}
        selectedCourses={selectedCourses}
        semester="秋"
        module="A"
      />
      <h3>B</h3>
      <Timetable
        courses={courses}
        selectedCourses={selectedCourses}
        semester="秋"
        module="B"
      />
      <h3>C</h3>
      <Timetable
        courses={courses}
        selectedCourses={selectedCourses}
        semester="秋"
        module="C"
      />
      <h2>その他</h2>
      <ul>
        {courses
          .filter(
            (course) =>
              isTaking(selectedCourses, course.code) &&
              ["集中", "応談", "随時"].includes(course.period),
          )
          .map((course) => (
            <li key={course.code}>
              {course.name} {course.module} {course.period}
            </li>
          ))}
      </ul>
    </div>
  );
};

const Timetable: FC<{
  courses: Array<Course>;
  selectedCourses: SelectedCourses;
  semester: string;
  module: string;
}> = ({ courses, selectedCourses, semester, module }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>時限</TableHead>
          <TableHead>月</TableHead>
          <TableHead>火</TableHead>
          <TableHead>水</TableHead>
          <TableHead>木</TableHead>
          <TableHead>金</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {["1", "2", "3", "4", "5", "6"].map((period) => (
          <TableRow key={period}>
            <TableCell>{period}</TableCell>
            {["月", "火", "水", "木", "金"].map((dayOfWeek) => (
              <TableCell key={dayOfWeek}>
                {courses
                  .filter(
                    (course) =>
                      course.module.includes(semester) &&
                      course.module.includes(module) &&
                      course.period.includes(dayOfWeek) &&
                      course.period.includes(period) &&
                      isTaking(selectedCourses, course.code),
                  )
                  .map((course) => (
                    <div>
                      {course.name}({course.standardYear})
                    </div>
                  ))}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
