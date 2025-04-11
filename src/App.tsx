import "./App.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { CourseView } from "./views/CourseView";
import { RequirementView } from "./views/RequirementView";
import { RequiredCourseView } from "./views/RequiredCourseView";
import { TimetableView } from "./views/TimetableView.tsx";
import { usePersistState } from "./hooks/persistState.ts";
import { Toaster } from "./components/ui/sonner.tsx";
import { SettingsView } from "./views/SettingsView.tsx";

export default function App() {
  const [courseTags, setCourseTags] = usePersistState("courseTags", new Map());

  return (
    <div className="xl:container">
      <Tabs defaultValue="1">
        <TabsList>
          <TabsTrigger value="1">履修組み</TabsTrigger>
          <TabsTrigger value="2">卒業判定</TabsTrigger>
          <TabsTrigger value="3">必修科目</TabsTrigger>
          <TabsTrigger value="4">時間割</TabsTrigger>
          <TabsTrigger value="5">設定</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <CourseView courseTags={courseTags} setCourseTags={setCourseTags} />
        </TabsContent>
        <TabsContent value="2">
          <RequirementView
            courseTags={courseTags}
            setCourseTags={setCourseTags}
          />
        </TabsContent>
        <TabsContent value="3">
          <RequiredCourseView
            courseTags={courseTags}
            setCourseTags={setCourseTags}
          />
        </TabsContent>
        <TabsContent value="4">
          <TimetableView courseTags={courseTags} />
        </TabsContent>
        <TabsContent value="5">
          <SettingsView courseTags={courseTags} setCourseTags={setCourseTags} />
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
}
