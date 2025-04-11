import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { courseTagValues } from "@/models/courseTag";
import { CourseViewItemTag } from "@/models/courseView";

interface CourseTagSelectorProps {
  tag: CourseViewItemTag;
  disabled: boolean;
  onClick: (newTag: CourseViewItemTag) => void;
}

export function CourseTagSelector(props: CourseTagSelectorProps) {
  return (
    <RadioGroup
      value={props.tag}
      onValueChange={(newValue: CourseViewItemTag) => {
        props.onClick(newValue);
      }}
      className="flex w-fit max-w-md rounded-lg bg-gray-100 p-1"
    >
      <div className="flex w-full gap-1">
        {courseTagValues.map((tag) => (
          <div key={tag} className="relative flex-1">
            <Label
              className={cn(
                "flex cursor-pointer items-center justify-center rounded-lg px-2 py-[3px] text-sm font-medium text-nowrap transition-all",
                props.tag === tag
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:bg-gray-200",
                props.disabled &&
                  "cursor-not-allowed opacity-50 hover:bg-transparent",
              )}
            >
              <RadioGroupItem
                value={tag}
                disabled={props.disabled}
                className="absolute inset-0 z-10 opacity-0"
              />
              {tagToText(tag)}
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
}

function tagToText(tag: CourseViewItemTag): string {
  switch (tag) {
    case "enrolled":
      return "履修済み";
    case "planned":
      return "履修する";
    case "considering":
      return "興味あり";
    case "declined":
      return "x";
    case "ineligible":
      return "履修不可";
  }
}
