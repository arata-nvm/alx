import { ReactNode } from "react";
import { loadCourses } from "../models/course";
import {
  inquiryRequirementStatus,
  RequirementStatus,
  loadRequirementViewItem,
} from "../models/requirementView";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { FormatCourseCreditRange, FormatJudgement } from "../components/Format";
import { CourseTags } from "../models/courseTag";

export interface RequirementViewProps {
  courseTags: CourseTags;
}

export function RequirementView({ courseTags }: RequirementViewProps) {
  const courses = loadCourses();
  const item = loadRequirementViewItem();
  const status = inquiryRequirementStatus(item, courses, courseTags);
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
      <TableBody>{genInnerRequirementView(status, 0)}</TableBody>
    </Table>
  );
}

function genInnerRequirementView(status: RequirementStatus, depth: number) {
  let children: Array<ReactNode> = [];
  if (status.children) {
    children = status.children.map((child) =>
      genInnerRequirementView(child, depth + 1),
    );
  }

  return (
    <>
      <TableRow key={status.name}>
        <TableCell>
          <RequirementClass
            name={status.name}
            courseNames={status.courseNames}
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
  courseNames: Array<string>;
  depth: number;
}

function RequirementClass({ name, courseNames, depth }: RequirementClassProps) {
  const indents = ["", "ml-4", "ml-8", "ml-12", "ml-16", "ml-20"];
  return (
    <div className={indents[depth]}>
      <p className="font-semibold">{name}</p>
      <p className="text-xs">{courseNames.join(", ")}</p>
    </div>
  );
}
