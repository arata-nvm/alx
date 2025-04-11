import { V1Course } from "@/models/course";
import { CourseTags, setCourseTag } from "@/models/courseTag";
import { useCallback, useState } from "react";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function replacer(_: string, value: any) {
  if (value instanceof Map) {
    return { version: "v2", value: Array.from(value.entries()) };
  } else {
    return value;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reviver(_: string, value: any) {
  if (typeof value === "object" && value !== null && value.version === "v2") {
    return new Map(value.value);
  } else {
    return value;
  }
}

const v1PersistKey = "courses";
export const persistKey = "courses_v2";

export function usePersistState(
  initialValue: CourseTags,
): [CourseTags, (state: CourseTags) => void] {
  let defaultValue = initialValue;

  const v2StorageItem = localStorage.getItem(persistKey);
  if (v2StorageItem !== null && v2StorageItem.trim() !== "") {
    defaultValue = JSON.parse(v2StorageItem, reviver);
  } else {
    const v1StorageItem = localStorage.getItem(v1PersistKey);
    if (v1StorageItem !== null && v1StorageItem.trim() !== "") {
      const v1Courses: V1Course[] = JSON.parse(v1StorageItem) ?? [];
      v1Courses
        .filter((course) => course.status === "take")
        .forEach((course) => {
          defaultValue = setCourseTag(defaultValue, course.code, "planned");
        });
    }
    localStorage.setItem(persistKey, JSON.stringify(defaultValue, replacer));
  }

  const [state, setState] = useState(defaultValue);

  const setPersistState = useCallback((state: CourseTags) => {
    localStorage.setItem(persistKey, JSON.stringify(state, replacer));
    setState(state);
  }, []);

  return [state, setPersistState];
}
