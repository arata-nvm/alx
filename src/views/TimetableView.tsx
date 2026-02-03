import { loadCourses } from "@/models/course";
import { FC, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import {
  CourseTag,
  filterByTag,
  SelectedCourses,
} from "@/models/selectedCourse";
import {
  courseDayValues,
  coursePeriodValues,
  sortTimetableViewItems,
  TimetableViewItem,
} from "@/models/timetable";
import { cn } from "@/lib/utils";
import { SyllabusLink } from "@/components/SyllabusLink";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const tagColors = {
  enrolled: "text-green-800",
  planned: "text-blue-800",
  considering: "text-yellow-800",
  declined: "text-white",
  ineligible: "text-gray-800",
};

type QueryOption = CourseTag | "all";

const queryOptions = [
  ["all", "すべて"],
  ["enrolled", "履修済み"],
  ["planned", "履修する"],
  ["considering", "興味あり"],
];

export const TimetableView: FC<{
  selectedCourses: SelectedCourses;
}> = ({ selectedCourses }) => {
  const [queryOption, setQueryOption] = useState<QueryOption>("planned");

  const courses = loadCourses();
  const filteredSelectedCourses =
    queryOption === "all"
      ? selectedCourses
      : filterByTag(selectedCourses, queryOption);
  const items = sortTimetableViewItems(courses, filteredSelectedCourses);

  return (
    <div className="text-left">
      <div>
        <Select
          onValueChange={(value: QueryOption) => setQueryOption(value)}
          defaultValue="planned"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {queryOptions.map((option) => (
              <SelectItem key={option[0]} value={option[0]}>
                {option[1]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
          <li
            key={course.code}
            className={cn(tagColors[course.tag], "list-disc")}
          >
            {course.code}{" "}
            <SyllabusLink code={course.code}>
              {course.name}({course.standardYear})
            </SyllabusLink>{" "}
            {course.module} {course.period}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Timetable: FC<{
  item: TimetableViewItem;
}> = ({ item }) => {
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
              <TableCell key={day} className="align-top">
                {item
                  .get(day)
                  ?.get(period)
                  ?.map((course) => (
                    <div className={cn(tagColors[course.tag], "my-2")}>
                      <p className="text-xs">{course.code}</p>
                      <p className="-my-1">
                        <SyllabusLink code={course.code}>
                          {course.name}({course.standardYear})
                        </SyllabusLink>
                      </p>
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
