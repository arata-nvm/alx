import { FC, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { importFromTwins } from "@/models/importFromTwins";
import { persistKey } from "@/hooks/persistState";
import { SelectedCourses } from "@/models/selectedCourse";

export const SettingsView: FC<{
  selectedCourses: SelectedCourses;
  setSelectedCourses: (courses: SelectedCourses) => void;
}> = ({ selectedCourses, setSelectedCourses }) => {
  const [importData, setImportData] = useState<string>("");
  const [file, setFile] = useState<File | undefined>(undefined);
  const [importedCourses, setImportedCourses] = useState<string[]>([]);
  const [failedCourses, setFailedCourses] = useState<string[]>([]);
  const [skipFailed, setSkipFailed] = useState<boolean>(false);

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
        <div className="my-2 flex items-center gap-2">
          <Label htmlFor="skip-failed-toggle">D/Fは無視する</Label>
          <input
            id="skip-failed-toggle"
            type="checkbox"
            checked={skipFailed}
            onChange={(e) => setSkipFailed(e.target.checked)}
          />
        </div>
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

              const result = importFromTwins(text, selectedCourses, skipFailed);
              setSelectedCourses(result.selectedCourses);
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
