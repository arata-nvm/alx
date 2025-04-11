import { FC, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { importFromTwins } from "@/models/importFromTwins";
import { CourseTags } from "@/models/courseTag";
import { persistKey } from "@/hooks/persistState";

export const SettingsView: FC<{
  courseTags: CourseTags;
  setCourseTags: (courses: CourseTags) => void;
}> = ({ courseTags, setCourseTags }) => {
  const [importData, setImportData] = useState<string>("");
  const [file, setFile] = useState<File | undefined>(undefined);
  const [importedCourses, setImportedCourses] = useState<string[]>([]);
  const [failedCourses, setFailedCourses] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-4 text-left">
      <h2>データのエクスポート・インポート</h2>
      <div>
        <h3>エクスポート</h3>
        <Textarea value={localStorage.getItem(persistKey) ?? ""} readOnly />
      </div>
      <div className="flex flex-col gap-1">
        <h3>インポート</h3>
        <Textarea
          value={importData}
          onChange={(e) => setImportData(e.target.value)}
        />
        <Button
          className="my-1 w-fit"
          onClick={() => {
            if (importData === "") {
              alert("インポートするデータが空です");
              return;
            }
            localStorage.setItem(persistKey, importData);
            window.location.reload();
          }}
        >
          インポート
        </Button>
      </div>
      <hr />
      <h2>TWINSからデータをインポート</h2>
      <div>
        <Input
          className="w-fit"
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        <Button
          className="my-1 w-fit"
          onClick={() => {
            if (!file) {
              toast("ファイルが選択されていません");
              return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
              const text = event?.target?.result;
              if (!text || typeof text !== "string") {
                toast("ファイルの読み込みに失敗しました");
                return;
              }

              const result = importFromTwins(text, courseTags);
              setCourseTags(result.courseTags);
              setImportedCourses(result.importedCourses);
              setFailedCourses(result.failedCourses);
              toast("インポートが完了しました");
            };
            reader.readAsText(file);
          }}
        >
          インポート
        </Button>
        {importedCourses.length > 0 && (
          <div>
            <p>インポートされた科目:</p>
            <ul className="list-disc">
              {importedCourses.map((course) => (
                <li key={course}>{course}</li>
              ))}
            </ul>
          </div>
        )}
        {failedCourses.length > 0 && (
          <div>
            <p>インポートに失敗した科目:</p>
            <ul className="list-disc">
              {failedCourses.map((course) => (
                <li key={course}>{course}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
