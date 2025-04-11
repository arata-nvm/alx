import { useCallback, useState } from "react";

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

export function usePersistState<T>(key: string, initialValue: T) {
  let defaultValue = initialValue;
  const storageItem = localStorage.getItem(key);
  if (storageItem === null || storageItem.trim() === "") {
    localStorage.setItem(key, JSON.stringify(initialValue, replacer));
  } else {
    defaultValue = JSON.parse(storageItem, reviver);
  }

  const [state, setState] = useState(defaultValue);

  const setPersistState = useCallback(
    (state: T) => {
      localStorage.setItem(key, JSON.stringify(state, replacer));
      setState(state);
    },
    [key],
  );

  return [state, setPersistState];
}
