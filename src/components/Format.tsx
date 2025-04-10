import { CourseCredit } from "../models/course";
import { CourseCreditRange } from "../models/requirementView";

export interface FormatCourseCreditRangeProps {
  range: CourseCreditRange;
}

export function FormatCourseCreditRange(props: FormatCourseCreditRangeProps) {
  if (!props.range.max) {
    return `${props.range.min}~`;
  } else if (props.range.min === props.range.max) {
    return `${props.range.min}`;
  } else {
    return `${props.range.min}~${props.range.max}`;
  }
}

export interface FormatJudgementProps {
  credit: CourseCredit;
  range: CourseCreditRange;
}

export function FormatJudgement({ credit, range }: FormatJudgementProps) {
  if (credit < range.min) {
    return `❌ -${range.min - credit}`;
  }
  if (range.max && credit > range.max) {
    return `✅(+${credit - range.max})`;
  }
  return "✅";
}
