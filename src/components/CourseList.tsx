import { ExternalLink } from "lucide-react";
import { CourseCode } from "@/models/course";
import { Badge } from "./ui/badge";
import { CourseViewItem, CourseViewItemTag } from "@/models/courseView";

export interface CourseListProps {
  items: Array<CourseViewItem>;
  onCourseClick: (code: CourseCode, tag: CourseViewItemTag) => void;
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
  onClick: (code: CourseCode, tag: CourseViewItemTag) => void;
}

function CourseListItem(props: CourseListItemProps) {
  const { itemStyle } = tagToColor(props.item.tag);
  return (
    <div className={`flex items-center border-l-4 px-1 ${itemStyle}`}>
      <a
        href={`https://kdb.tsukuba.ac.jp/syllabi/2023/${props.item.code}/jpn`}
        target="_blank"
      >
        <ExternalLink />
      </a>
      <div
        className="flex w-full cursor-pointer justify-between pl-2"
        onClick={() => props.onClick(props.item.code, props.item.tag)}
      >
        <div className="flex flex-col items-start">
          <span className="text-xs">{props.item.code}</span>
          <b className="text-md max-w-3xl text-left">{props.item.name}</b>
        </div>
        <div className="flex items-center gap-x-4">
          <CourseTagBadge tag={props.item.tag} />
          <div className="text-right">
            <span className="text-md">{props.item.module}</span>
          </div>
          <div className="w-16 text-right">
            <span className="text-md">{props.item.period}</span>
            <span className="text-xs">時限</span>
          </div>
          <div className="w-12 text-right">
            <span className="text-md">{props.item.credit}</span>
            <span className="text-xs">単位</span>
          </div>
          <div className="w-16 text-right">
            <span className="text-md">{props.item.standardYear}</span>
            <span className="text-xs">年次</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CourseTagBadgeProps {
  tag: CourseViewItemTag;
}

function CourseTagBadge(props: CourseTagBadgeProps) {
  // const { badgeStyle } = statusToColor(props.status);
  const text = tagToText(props.tag);
  return <Badge variant="outline">{text}</Badge>;
}

interface CourseTagColor {
  itemStyle: string;
  badgeStyle: string;
}

function tagToColor(status: CourseViewItemTag): CourseTagColor {
  switch (status) {
    case "default":
      return { itemStyle: "border-white", badgeStyle: "outline" };
    case "take":
      return { itemStyle: "border-teal-100 bg-teal-50", badgeStyle: "outline" };
    case "invalid":
      return {
        itemStyle: "border-gray-200 bg-gray-100",
        badgeStyle: "outline",
      };
  }
}

function tagToText(status: CourseViewItemTag): string {
  switch (status) {
    case "default":
      return "履修しない";
    case "take":
      return "履修する";
    case "invalid":
      return "履修不可";
  }
}
