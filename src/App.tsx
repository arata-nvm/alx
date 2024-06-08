import './App.css'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { loadCourses } from './models/course';
import { CourseView } from './views/CourseView';
import { RequirementView } from './views/RequirementView';
import { RequiredCourseView } from './views/RequiredCourseView';
import { usePersistState } from './hooks/persistState';
import {TimetableView} from "./views/TimetableView.tsx";

export default function App() {
  const [courses, setCourses] = usePersistState("courses", loadCourses());

  return (
    <div className='xl:container'>
      <Tabs defaultValue="1">
        <TabsList>
          <TabsTrigger value="1">履修組み</TabsTrigger>
          <TabsTrigger value="2">卒業判定</TabsTrigger>
          <TabsTrigger value="3">必修科目</TabsTrigger>
          <TabsTrigger value="4">時間割</TabsTrigger>
        </TabsList>
        <TabsContent value="1"><CourseView courses={courses} setCourses={setCourses} /></TabsContent>
        <TabsContent value="2"><RequirementView courses={courses} /></TabsContent>
        <TabsContent value="3"><RequiredCourseView courses={courses} setCourses={setCourses} /></TabsContent>
        <TabsContent value="4"><TimetableView courses={courses} /></TabsContent>
      </Tabs>
    </div >
  );
}
