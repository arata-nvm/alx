import { useState } from "react";
import { CourseCode } from "@/models/course";
import { RequiredCourse, loadRequiredCourses } from "@/models/required";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseTags, setCourseTag } from "@/models/courseTag";
import { toast } from "sonner";

export interface RequiredCourseViewProps {
  courseTags: CourseTags;
  setCourseTags: (courses: CourseTags) => void;
}

export function RequiredCourseView({
  courseTags,
  setCourseTags,
}: RequiredCourseViewProps) {
  const requiredCourses = loadRequiredCourses();
  const [selectedCourseCodes, setCourseCodes] = useState<
    Array<Array<CourseCode>>
  >(new Array(requiredCourses.length));

  const onClick = () => {
    toast("必修科目を追加しました");

    let newCourseTags = courseTags;
    selectedCourseCodes.forEach((codes) =>
      codes.forEach((code) => {
        newCourseTags = setCourseTag(newCourseTags, code, "planned");
      }),
    );
    setCourseTags(newCourseTags);
  };

  const onChange = (index: number, name: string) => {
    const option = requiredCourses[index].options?.find(
      (option) => option.name == name,
    );
    if (option === undefined) {
      return;
    }

    setCourseCodes((prev) => {
      prev[index] = option.courseCodes;
      return prev;
    });
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-4 flex flex-col gap-y-2">
        {requiredCourses.map((required, index) => (
          <RequiredCourseOptionItem
            key={required.name}
            required={required}
            onChange={(name) => onChange(index, name)}
          />
        ))}
      </div>
      <Button onClick={onClick}>必修科目を追加する</Button>
    </div>
  );
}

interface RequiredCourseOptionItemProps {
  required: RequiredCourse;
  onChange: (name: string) => void;
}

function RequiredCourseOptionItem(props: RequiredCourseOptionItemProps) {
  const donothingItem = { name: "追加しない", courseCodes: [] };
  const options = [donothingItem, ...(props.required.options || [])];

  return (
    <div>
      <p className="text-start font-semibold">{props.required.name}</p>
      <Select
        onValueChange={(value: string) => props.onChange(value)}
        defaultValue="追加しない"
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.name} value={option.name}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
