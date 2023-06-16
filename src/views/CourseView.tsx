import { Course, CourseCode, takeCourse } from "../models/course";
import { CourseViewItem, collectCoursesFromCourseView, loadCourseViewItems } from "../models/courseView";
import { CourseList } from "../components/CourseList";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Summary } from "../components/Summary";

export interface CourseViewProps {
  courses: Array<Course>,
  setCourses: (courses: Array<Course>) => void,
}

export function CourseView({ courses, setCourses }: CourseViewProps) {
  const onCourseClick = (code: CourseCode) => {
    setCourses(takeCourse(courses, code));
  };

  const tabs = [];
  const contents = []
  for (const item of loadCourseViewItems()) {
    const [tab, content] = genInnerCourseView(item, courses, onCourseClick);
    tabs.push(tab);
    contents.push(content);
  }

  const defaultValue = tabs[0].props.value;

  return (
    <div>
      <Tabs defaultValue={defaultValue} className='text-start mb-16'>
        <TabsList>{tabs}</TabsList>
        {contents}
      </Tabs>
      <Summary courses={courses} />
    </div>
  );
}

function genInnerCourseView(item: CourseViewItem, courses: Array<Course>, onCourseClick: (code: CourseCode) => void) {
  const tab = <TabsTrigger key={item.name} value={item.name} disabled={item.isDisabled}>{item.name}</TabsTrigger>;

  if (!item.children) {
    const itemCourses = collectCoursesFromCourseView(courses, item);
    const content = (
      <TabsContent key={item.name} value={item.name}>
        <div className='mt-4'>
          <CourseList courses={itemCourses} onCourseClick={onCourseClick} />
        </div>
      </TabsContent>
    );
    return [tab, content];
  }

  const tabs = [];
  const contents = []
  for (const childItem of item.children) {
    const [tab, content] = genInnerCourseView(childItem, courses, onCourseClick);
    tabs.push(tab);
    contents.push(content);
  }

  const defaultValue = tabs[0].props.value;

  const content = (
    <TabsContent key={item.name} value={item.name}>
      <Tabs defaultValue={defaultValue}>
        <TabsList className='justify-start overflow-x-scroll w-full'>{tabs}</TabsList>
        {contents}
      </Tabs>
    </TabsContent >
  );

  return [tab, content];
}
