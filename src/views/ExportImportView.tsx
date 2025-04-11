import { FC, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const ExportImportView: FC = () => {
  const [importData, setImportData] = useState<string>("");

  return (
    <div className="flex flex-col gap-4 text-left">
      <div>
        <h2>エクスポート</h2>
        <Textarea value={localStorage.getItem("courseTags") ?? ""} />
      </div>
      <div className="flex flex-col gap-1">
        <h2>インポート</h2>
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
            localStorage.setItem("courseTags", importData);
          }}
        >
          インポート
        </Button>
      </div>
    </div>
  );
};
