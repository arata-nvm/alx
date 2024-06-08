import { Course, CourseCode, takeCourse } from "../models/course";
import {CourseViewItem, getCourseViewItems} from "../models/courseView";
import { CourseList } from "../components/CourseList";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Summary } from "../components/Summary";
import {FC} from "react";

export const CourseView: FC<{
  courses: Array<Course>,
  setCourses: (courses: Array<Course>) => void,
}> = ({ courses, setCourses }) => {
  const onCourseClick = (code: CourseCode) => {
    setCourses(takeCourse(courses, code));
  };

  const tabs = [];
  const contents = [];
  for (const item of getCourseViewItems(courses)) {
    const [tab, content] = genInnerCourseView(item, onCourseClick);
    tabs.push(tab);
    contents.push(content);
  }

  const defaultTab = tabs.find(tab => !tab.props.disabled)?.props.value;
  return (
    <div>
      <Tabs defaultValue={defaultTab} className='text-start mb-16'>
        <TabsList>{tabs}</TabsList>
        {contents}
      </Tabs>
      <Summary courses={courses} />
    </div>
  );
};

function genInnerCourseView(item: CourseViewItem, onCourseClick: (code: CourseCode) => void) {
  const tab = <TabsTrigger key={item.name} value={item.name} disabled={item.isDisabled}>{item.name}</TabsTrigger>;

  if (item.children.length === 0) {
    const content = (
      <TabsContent key={item.name} value={item.name}>
        <div className='mt-4'>
          <CourseList courses={item.courseList} onCourseClick={onCourseClick} />
        </div>
      </TabsContent>
    );
    return [tab, content];
  }

  const tabs = [];
  const contents = [];
  for (const childItem of item.children) {
    const [tab, content] = genInnerCourseView(childItem, onCourseClick);
    tabs.push(tab);
    contents.push(content);
  }

  const defaultTab = tabs.find(tab => !tab.props.disabled)?.props.value;
  const content = (
    <TabsContent key={item.name} value={item.name}>
      <Tabs defaultValue={defaultTab}>
        <TabsList className='justify-start overflow-x-scroll w-full'>{tabs}</TabsList>
        {contents}
      </Tabs>
    </TabsContent >
  );

  return [tab, content];
}
