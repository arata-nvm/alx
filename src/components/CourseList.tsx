import { ExternalLink } from "lucide-react";
import { Course, CourseCode, CourseStatus } from "../models/course";
import { Badge } from "./ui/badge";

export interface CourseListProps {
  courses: Array<Course>,
  onCourseClick: (code: CourseCode) => void,
}

export function CourseList(props: CourseListProps) {
  return (
    <div className='flex flex-col gap-y-1'>
      {props.courses.map(course => <CourseListItem key={course.code} course={course} onClick={props.onCourseClick} />)}
    </div>
  );
}

interface CourseListItemProps {
  course: Course,
  onClick: (code: CourseCode) => void,
}

function CourseListItem(props: CourseListItemProps) {
  const { itemStyle } = statusToColor(props.course.status);
  return (
    <div className={`flex items-center px-1 border-l-4 ${itemStyle}`}>
      <div className='flex justify-between pr-4 w-full cursor-pointer' onClick={() => props.onClick(props.course.code)}>
        <div className='flex flex-col items-start'>
          <span className='text-xs'>{props.course.code}</span>
          <b className='text-md text-left max-w-3xl'>{props.course.name}</b>
        </div>
        <div className='flex items-center gap-x-4'>
          <CourseStatusBadge status={props.course.status} />
          <div>
            <span className='text-md'>{props.course.credit}</span>
            <span className='text-xs'>単位</span>
          </div>
        </div>
      </div>
      <a href={`https://kdb.tsukuba.ac.jp/syllabi/2023/${props.course.code}/jpn`} target='_blank'><ExternalLink /></a>
    </div>
  );
}

interface CourseStatusBadgeProps {
  status: CourseStatus,
}

function CourseStatusBadge(props: CourseStatusBadgeProps) {
  // const { badgeStyle } = statusToColor(props.status);
  const text = statusToText(props.status);
  return (<Badge variant='outline'>{text}</Badge>);
}

interface CourseStatusColor {
  itemStyle: string,
  badgeStyle: string,
}

function statusToColor(status: CourseStatus): CourseStatusColor {
  switch (status) {
    case 'default':
      return { itemStyle: 'border-white', badgeStyle: 'outline' };
    case 'take':
      return { itemStyle: 'border-teal-100 bg-teal-50', badgeStyle: 'outline' };
    case 'invalid':
      return { itemStyle: 'border-gray-200 bg-gray-100', badgeStyle: 'outline' };
  }
}

function statusToText(status: CourseStatus): string {
  switch (status) {
    case 'default':
      return '履修しない';
    case 'take':
      return '履修する';
    case 'invalid':
      return '履修不可';
  }
}
