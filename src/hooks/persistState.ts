import { useCallback, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function replacer(_: string, value: any) {
  if (value instanceof Map) {
    return { dataType: "Map", value: Array.from(value.entries()) };
  } else {
    return value;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reviver(_: string, value: any) {
  if (typeof value === "object" && value !== null && value.dataType === "Map") {
    return new Map(value.value);
  } else {
    return value;
  }
}

export function usePersistState<T>(key: string, initialValue: T) {
  let defaultValue;
  const storageItem = localStorage.getItem(key);
  if (storageItem !== null) {
    defaultValue = JSON.parse(storageItem, reviver);
  } else {
    defaultValue = initialValue;
    localStorage.setItem(key, JSON.stringify(initialValue, replacer));
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
