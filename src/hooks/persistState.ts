import { useCallback, useState } from "react";

export function usePersistState<T>(key: string, initialValue: T) {
  let defaultValue;
  const storageItem = localStorage.getItem(key);
  if (storageItem !== null) {
    defaultValue = JSON.parse(storageItem);
  } else {
    defaultValue = initialValue;
    localStorage.setItem(key, JSON.stringify(initialValue));
  }

  const [state, setState] = useState(defaultValue);

  const setPersistState = useCallback(
    (state: T) => {
      localStorage.setItem(key, JSON.stringify(state));
      setState(state);
    },
    [key]
  );

  return [state, setPersistState];
}
