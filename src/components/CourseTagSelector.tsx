import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { CourseViewItemTag } from "@/models/courseView";
import { courseTagValues } from "@/models/selectedCourse";
import { cva, VariantProps } from "class-variance-authority";

const selectorVariants = cva(
  "flex cursor-pointer items-center justify-center rounded-lg px-2 py-[3px] font-medium text-nowrap transition-all",
  {
    variants: {
      variant: {
        base: "text-sm",
        small: " text-xs ",
      },
    },
    defaultVariants: {
      variant: "base",
    },
  },
);

interface CourseTagSelectorProps {
  tag: CourseViewItemTag;
  disabled: boolean;
  onClick: (newTag: CourseViewItemTag) => void;
}

export function CourseTagSelector(
  props: CourseTagSelectorProps & VariantProps<typeof selectorVariants>,
) {
  const tagColors = {
    enrolled: "bg-green-100",
    planned: "bg-blue-100",
    considering: "bg-yellow-100",
    declined: "bg-white",
    ineligible: "bg-gray-500",
  };
  return (
    <RadioGroup
      value={props.tag}
      onValueChange={(newValue: CourseViewItemTag) => {
        props.onClick(newValue);
      }}
      className="inline-block w-fit max-w-md rounded-lg bg-gray-100 p-1"
    >
      <div className="flex w-full gap-1">
        {courseTagValues.map((tag) => (
          <div key={tag} className="relative flex-1">
            <Label
              className={cn(
                selectorVariants({ variant: props.variant }),
                props.tag === tag
                  ? `${tagColors[tag]} text-black shadow-sm`
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
