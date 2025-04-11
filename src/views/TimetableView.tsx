import { loadCourses } from "@/models/course";
import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { SelectedCourses } from "@/models/selectedCourse";
import {
  courseDayValues,
  coursePeriodValues,
  sortTimetableViewItems,
  TimetableViewItem,
} from "@/models/timetable";

export const TimetableView: FC<{
  selectedCourses: SelectedCourses;
}> = ({ selectedCourses }) => {
  const courses = loadCourses();
  const items = sortTimetableViewItems(courses, selectedCourses);
  return (
    <div className="text-left">
      <h2>春</h2>
      <h3>A</h3>
      <Timetable item={items.springA} />
      <h3>B</h3>
      <Timetable item={items.springB} />
      <h3>C</h3>
      <Timetable item={items.springC} />
      <h2>秋</h2>
      <h3>A</h3>
      <Timetable item={items.fallA} />
      <h3>B</h3>
      <Timetable item={items.fallB} />
      <h3>C</h3>
      <Timetable item={items.fallC} />
      <h2>その他</h2>
      <ul>
        {items.others.map((course) => (
          <li key={course.code} className="list-disc">
            {course.name}({course.standardYear}) {course.module} {course.period}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Timetable: FC<{
  item: TimetableViewItem;
}> = ({ item }) => {
  const tagColors = {
    enrolled: "text-green-800",
    planned: "text-blue-800",
    considering: "text-yellow-800",
    declined: "text-white",
    ineligible: "text-gray-800",
  };
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
        {coursePeriodValues.map((period) => (
          <TableRow key={period}>
            <TableCell>{period}</TableCell>
            {courseDayValues.map((day) => (
              <TableCell key={day}>
                {item
                  .get(day)
                  ?.get(period)
                  ?.map((course) => (
                    <p className={tagColors[course.tag]}>
                      {course.name}({course.standardYear})
                    </p>
                  ))}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
