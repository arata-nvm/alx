import { ExternalLink } from "lucide-react";
import { Course } from "@/models/course";
import { CourseViewItem, CourseViewItemTag } from "@/models/courseView";
import { CourseTagSelector } from "./CourseTagSelector";
import { SyllabusLink } from "./SyllabusLink";

export interface CourseListProps {
  items: Array<CourseViewItem>;
  onCourseClick: (course: Course, newTag: CourseViewItemTag) => void;
}

export function CourseList(props: CourseListProps) {
  return (
    <div className="flex flex-col gap-y-1">
      {props.items.map((item) => (
        <CourseListItem
          key={item.code}
          item={item}
          onClick={props.onCourseClick}
        />
      ))}
    </div>
  );
}

interface CourseListItemProps {
  item: CourseViewItem;
  onClick: (course: Course, newTag: CourseViewItemTag) => void;
}

function CourseListItem(props: CourseListItemProps) {
  const style = tagToColor(props.item.tag);
  return (
    <div className={`flex items-center border-l-4 px-1 ${style}`}>
      <SyllabusLink code={props.item.code}>
        <ExternalLink />
      </SyllabusLink>
      <div className="flex w-full justify-between pl-2">
        <div className="flex flex-col items-start">
          <span className="text-xs">{props.item.code}</span>
          <b className="text-md max-w-3xl text-left">{props.item.name}</b>
        </div>
        <div className="flex items-center gap-x-4">
          <div className="text-right">
            <span className="text-md">{props.item.module}</span>
          </div>
          <div className="w-20 text-right">
            <span className="text-md">{props.item.period}</span>
          </div>
          <div className="w-12 text-right">
            <span className="text-md">{props.item.credit}</span>
            <span className="text-xs">単位</span>
          </div>
          <div className="w-16 text-right">
            <span className="text-md">{props.item.standardYear}</span>
            <span className="text-xs">年次</span>
          </div>
          <CourseTagSelector
            tag={props.item.tag}
            disabled={props.item.tag === "ineligible"}
            onClick={(tag) => props.onClick(props.item, tag)}
          />
        </div>
      </div>
    </div>
  );
}

function tagToColor(tag: CourseViewItemTag): string {
  return tag === "ineligible" ? "border-gray-200 bg-gray-100" : "";
}
