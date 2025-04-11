import { ReactNode } from "react";
import {
  inquiryRequirementStatus,
  RequirementStatus,
  loadRequirementViewItem,
} from "@/models/requirementView";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormatCourseCreditRange, FormatJudgement } from "@/components/Format";
import { CourseTagSelector } from "@/components/CourseTagSelector";
import { CourseViewItemTag } from "@/models/courseView";
import {
  SelectedCourse,
  SelectedCourses,
  setSelectedCourse,
} from "@/models/selectedCourse";
import { SyllabusLink } from "@/components/SyllabusLink";

export interface RequirementViewProps {
  selectedCourses: SelectedCourses;
  setSelectedCourses: (courses: SelectedCourses) => void;
}

export function RequirementView({
  selectedCourses,
  setSelectedCourses,
}: RequirementViewProps) {
  const item = loadRequirementViewItem();
  const status = inquiryRequirementStatus(item, selectedCourses);
  const onTagClick = (course: SelectedCourse, newTag: CourseViewItemTag) => {
    if (newTag === "ineligible") return;
    setSelectedCourses(setSelectedCourse(selectedCourses, course, newTag));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>区分</TableHead>
          <TableHead>要件単位数</TableHead>
          <TableHead>認定単位数(単位数)</TableHead>
          <TableHead>判定</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{genInnerRequirementView(status, onTagClick, 0)}</TableBody>
    </Table>
  );
}

function genInnerRequirementView(
  status: RequirementStatus,
  onTagClick: (course: SelectedCourse, newTag: CourseViewItemTag) => void,
  depth: number,
) {
  let children: Array<ReactNode> = [];
  if (status.children) {
    children = status.children.map((child) =>
      genInnerRequirementView(child, onTagClick, depth + 1),
    );
  }

  return (
    <>
      <TableRow key={status.name}>
        <TableCell>
          <RequirementClass
            name={status.name}
            creditedCourses={status.creditedCourses}
            onTagClick={onTagClick}
            depth={depth}
          />
        </TableCell>
        <TableCell>
          <FormatCourseCreditRange range={status.creditRange} />
        </TableCell>
        <TableCell>{`${status.clampedCredit}(${status.credit})`}</TableCell>
        <TableCell>
          <FormatJudgement
            credit={status.clampedCredit}
            range={status.creditRange}
          />
        </TableCell>
      </TableRow>
      {children}
    </>
  );
}

interface RequirementClassProps {
  name: string;
  creditedCourses: Array<SelectedCourse>;
  onTagClick: (course: SelectedCourse, newTag: CourseViewItemTag) => void;
  depth: number;
}

function RequirementClass({
  name,
  creditedCourses,
  onTagClick,
  depth,
}: RequirementClassProps) {
  const indents = ["", "ml-4", "ml-8", "ml-12", "ml-16", "ml-20"];
  return (
    <div className={indents[depth]}>
      <p className="font-semibold">{name}</p>
      <div className="flex flex-col gap-1">
        {creditedCourses.map((course) => (
          <CreditedCourse course={course} onTagClick={onTagClick} />
        ))}
      </div>
    </div>
  );
}

interface CreditedCourseProps {
  course: SelectedCourse;
  onTagClick: (code: SelectedCourse, newTag: CourseViewItemTag) => void;
}

function CreditedCourse({ course, onTagClick }: CreditedCourseProps) {
  return (
    <div className="flex items-center justify-start gap-2">
      <p className="text-xs">
        {course.code}{" "}
        <SyllabusLink code={course.code}>{course.name}</SyllabusLink> (
        {course.credit}単位)
      </p>
      <CourseTagSelector
        variant="small"
        tag={course.tag}
        disabled={false}
        onClick={(newTag) => onTagClick(course, newTag)}
      />
    </div>
  );
}
