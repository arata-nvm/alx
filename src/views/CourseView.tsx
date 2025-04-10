import { CourseCode, loadCourses } from "../models/course";
import {
  CourseViewItemTag,
  CourseViewTab,
  getCourseViewTabs,
} from "../models/courseView";
import { CourseList } from "../components/CourseList";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Summary } from "../components/Summary";
import { FC } from "react";
import { CourseTags, toggleCourseTag } from "../models/courseTag";

export const CourseView: FC<{
  courseTags: CourseTags;
  setCourseTags: (courses: CourseTags) => void;
}> = ({ courseTags, setCourseTags }) => {
  const courses = loadCourses();
  const onCourseClick = (code: CourseCode, tag: CourseViewItemTag) => {
    if (tag === "invalid") return;
    setCourseTags(toggleCourseTag(courseTags, code));
  };

  const tabViews = [];
  const contents = [];
  for (const tab of getCourseViewTabs(courses, courseTags)) {
    const [tabView, content] = genInnerCourseView(tab, onCourseClick);
    tabViews.push(tabView);
    contents.push(content);
  }

  const defaultTab = tabViews.find((tabView) => !tabView.props.disabled)?.props
    .value;
  return (
    <div>
      <Tabs defaultValue={defaultTab} className="text-start mb-16">
        <TabsList>{tabViews}</TabsList>
        {contents}
      </Tabs>
      <Summary courses={courses} courseTags={courseTags} />
    </div>
  );
};

function genInnerCourseView(
  tab: CourseViewTab,
  onCourseClick: (code: CourseCode, tag: CourseViewItemTag) => void,
): [JSX.Element, JSX.Element] {
  const tabView = (
    <TabsTrigger key={tab.name} value={tab.name} disabled={tab.isDisabled}>
      {tab.name}
    </TabsTrigger>
  );

  if (tab.children.length === 0) {
    const content = (
      <TabsContent key={tab.name} value={tab.name}>
        <div className="mt-4">
          <CourseList items={tab.items} onCourseClick={onCourseClick} />
        </div>
      </TabsContent>
    );
    return [tabView, content];
  }

  const tabViews = [];
  const contents = [];
  for (const childItem of tab.children) {
    const [tabView, content] = genInnerCourseView(childItem, onCourseClick);
    tabViews.push(tabView);
    contents.push(content);
  }

  const defaultTab = tabViews.find((tabView) => !tabView.props.disabled)?.props
    .value;
  const content = (
    <TabsContent key={tab.name} value={tab.name}>
      <Tabs defaultValue={defaultTab}>
        <TabsList className="justify-start overflow-x-scroll w-full">
          {tabViews}
        </TabsList>
        {contents}
      </Tabs>
    </TabsContent>
  );

  return [tabView, content];
}
