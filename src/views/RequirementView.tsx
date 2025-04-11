import { ReactNode } from "react";
import { Course, CourseCode, loadCourses } from "@/models/course";
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
import { CourseTags, getCourseTag, setCourseTag } from "@/models/courseTag";
import { CourseTagSelector } from "@/components/CourseTagSelector";
import { CourseViewItemTag } from "@/models/courseView";

export interface RequirementViewProps {
  courseTags: CourseTags;
  setCourseTags: (courses: CourseTags) => void;
}

export function RequirementView({
  courseTags,
  setCourseTags,
}: RequirementViewProps) {
  const courses = loadCourses();
  const item = loadRequirementViewItem();
  const status = inquiryRequirementStatus(item, courses, courseTags);
  const onTagClick = (code: CourseCode, newTag: CourseViewItemTag) => {
    if (newTag === "ineligible") return;
    setCourseTags(setCourseTag(courseTags, code, newTag));
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
      <TableBody>
        {genInnerRequirementView(status, courseTags, onTagClick, 0)}
      </TableBody>
    </Table>
  );
}

function genInnerRequirementView(
  status: RequirementStatus,
  courseTags: CourseTags,
  onTagClick: (code: CourseCode, newTag: CourseViewItemTag) => void,
  depth: number,
) {
  let children: Array<ReactNode> = [];
  if (status.children) {
    children = status.children.map((child) =>
      genInnerRequirementView(child, courseTags, onTagClick, depth + 1),
    );
  }

  return (
    <>
      <TableRow key={status.name}>
        <TableCell>
          <RequirementClass
            name={status.name}
            creditedCourses={status.creditedCourses}
            courseTags={courseTags}
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
  creditedCourses: Array<Course>;
  courseTags: CourseTags;
  onTagClick: (code: CourseCode, newTag: CourseViewItemTag) => void;
  depth: number;
}

function RequirementClass({
  name,
  creditedCourses,
  courseTags,
  onTagClick,
  depth,
}: RequirementClassProps) {
  const indents = ["", "ml-4", "ml-8", "ml-12", "ml-16", "ml-20"];
  return (
    <div className={indents[depth]}>
      <p className="font-semibold">{name}</p>
      <div className="flex flex-col gap-1">
        {creditedCourses.map((course) => (
          <CreditedCourse
            course={course}
            courseTags={courseTags}
            onTagClick={onTagClick}
          />
        ))}
      </div>
    </div>
  );
}

interface CreditedCourseProps {
  course: Course;
  courseTags: CourseTags;
  onTagClick: (code: CourseCode, newTag: CourseViewItemTag) => void;
}

function CreditedCourse({
  course,
  courseTags,
  onTagClick,
}: CreditedCourseProps) {
  return (
    <div className="flex items-center justify-start gap-2">
      <p className="text-xs">{`${course.code} ${course.name} (${course.credit}単位)`}</p>
      <CourseTagSelector
        variant="small"
        tag={getCourseTag(courseTags, course.code)}
        disabled={false}
        onClick={(newTag) => onTagClick(course.code, newTag)}
      />
    </div>
  );
}
