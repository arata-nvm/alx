
import { FormatCourseCreditRange } from "./Format";
import { Course, CourseCredit } from "../models/course";
import { CourseCreditRange, inquiryRequirementStatus, loadRequirementViewItem } from "../models/requirementView";

export interface SummaryProps {
  courses: Array<Course>,
}

export function Summary({ courses }: SummaryProps) {
  const item = loadRequirementViewItem();
  const status = inquiryRequirementStatus(item, [...courses]);

  // FIXME
  const summary = [
    { name: '専門科目-必修科目', credit: status.children[0].children[0].credit, creditRange: status.children[0].children[0].creditRange },
    { name: '専門科目-選択科目', credit: status.children[0].children[1].credit, creditRange: status.children[0].children[1].creditRange },
    { name: '専門基礎科目-必修科目', credit: status.children[1].children[0].credit, creditRange: status.children[1].children[0].creditRange },
    { name: '専門基礎科目-選択科目', credit: status.children[1].children[1].credit, creditRange: status.children[1].children[1].creditRange },
    { name: '基礎科目-共通科目', credit: status.children[2].children[0].credit, creditRange: status.children[2].children[0].creditRange },
    { name: '基礎科目-関連科目', credit: status.children[2].children[1].credit, creditRange: status.children[2].children[1].creditRange },
  ];

  const totalItem =
    { name: '合計', credit: status.credit, creditRange: status.creditRange };


  return (
    <div className='fixed bottom-0 left-0 w-full px-8'>
      <div className='flex justify-between pt-2 pb-4 mt-8 px-2 mx-auto max-w-6xl backdrop-blur bg-white/75'>
        <div className='flex gap-x-4'>
          {summary.map(item => <SummaryItem key={item.name} {...item} />)}
        </div>
        <SummaryItem {...totalItem} />
      </div>
    </div>
  );
}

interface SummaryItemProps {
  name: string,
  credit: CourseCredit,
  creditRange: CourseCreditRange,
}

function SummaryItem(props: SummaryItemProps) {
  return (
    <div className='flex flex-col items-start'>
      <span className='text-xs'>{props.name}</span>
      <div className='flex gap-0 items-baseline'>
        <span className='text-2xl'>{props.credit}</span>
        <span className='text-md'>/</span>
        <span className='text-md'><FormatCourseCreditRange range={props.creditRange} /></span>
      </div>
    </div>
  );
}
