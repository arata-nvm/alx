import { CourseCode } from "@/models/course";
import { FC } from "react";

export const SyllabusLink: FC<{
  code: CourseCode;
  children?: React.ReactNode;
}> = ({ code, children }) => {
  return (
    <a
      href={`https://kdb.tsukuba.ac.jp/syllabi/2025/${code}/jpn`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};
