// Reference: https://usehooks-typescript.com/react-hook/use-local-storage
import { useState, useEffect, useCallback } from 'react';

function isJsonString(str: any) {
  try {
    JSON.parse(str);
  } catch (error) {
    return false;
  }
  return true;
}

function useLocalStorage<T>(keys: Array<keyof T>) {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = () => {
    // Prevent build error "window is undefined" but keep keep working
    if (typeof window === 'undefined') {
      return {} as T;
    }

    try {
      const value: T = {} as T;
      keys.forEach((key) => {
        const item = window.sessionStorage.getItem(String(key)) || undefined;
        value[key] = item && isJsonString(item) ? JSON.parse(item) : item;
      });
      return value;
    } catch (error) {
      console.warn(`Error reading localStorage key:`, error);
      return {} as T;
    }
  };

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(readValue());

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback(
    (value: T) => {
      // Prevent build error "window is undefined" but keeps working
      if (typeof window === 'undefined') {
        console.warn(
          `Tried setting localStorage keys even though environment is not a client`,
        );
      }

      try {
        keys.forEach((key) => {
          const data = value[key];
          if (data === undefined) {
            window.sessionStorage.removeItem(String(key));
          } else if (typeof data === 'string') {
            window.sessionStorage.setItem(String(key), data);
          } else {
            window.sessionStorage.setItem(String(key), JSON.stringify(data));
          }
        });

        // Save state
        setStoredValue(value);
      } catch (error) {
        console.warn(`Error setting localStorage keys:`, error);
      }
    },
    [keys],
  );

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    // this only works for other documents, not the current one
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { storedValue, setValue };
}

export default useLocalStorage;