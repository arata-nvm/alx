import { FormatCourseCreditRange } from "./Format";
import { CourseCredit } from "@/models/course";
import {
  CourseCreditRange,
  inquiryRequirementStatus,
  loadRequirementViewItem,
} from "@/models/requirementView";
import { SelectedCourses } from "@/models/selectedCourse";

export interface SummaryProps {
  selectedCourses: SelectedCourses;
}

export function Summary({ selectedCourses }: SummaryProps) {
  const item = loadRequirementViewItem();
  const rootStatus = inquiryRequirementStatus(item, selectedCourses);

  const names = [
    "専門-必修",
    "専門-選択",
    "専門基礎-必修",
    "専門基礎-選択",
    "基礎-共通",
    "基礎-関連",
  ];

  const summary = [];
  for (let i = 0; i < names.length; i++) {
    const status = rootStatus.children[Math.floor(i / 2)].children[i % 2];
    summary.push({
      name: names[i],
      credit: status.credit,
      clampedCredit: status.clampedCredit,
      creditRange: status.creditRange,
    });
  }

  const totalItem = {
    name: "合計",
    credit: rootStatus.credit,
    clampedCredit: rootStatus.clampedCredit,
    creditRange: rootStatus.creditRange,
  };

  return (
    <div className="fixed bottom-0 left-0 w-full px-8">
      <div className="mx-auto mt-8 flex max-w-6xl justify-between bg-white/75 px-2 pt-2 pb-4 backdrop-blur">
        <div className="flex gap-x-4">
          {summary.map((item) => (
            <SummaryItem key={item.name} {...item} />
          ))}
        </div>
        <SummaryItem {...totalItem} />
      </div>
    </div>
  );
}

interface SummaryItemProps {
  name: string;
  credit: CourseCredit;
  clampedCredit: CourseCredit;
  creditRange: CourseCreditRange;
}

function SummaryItem(props: SummaryItemProps) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-xs">{props.name}</span>
      <div className="flex items-baseline gap-0">
        <span className="text-2xl">{props.clampedCredit}</span>
        <span className="text-md">({props.credit})</span>
        <span className="text-md">/</span>
        <span className="text-md">
          <FormatCourseCreditRange range={props.creditRange} />
        </span>
      </div>
    </div>
  );
}
