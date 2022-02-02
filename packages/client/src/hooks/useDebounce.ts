import { useState, useEffect } from 'react';

const useDebounce = <T>(value: T, delay = 600): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearInterval(handler);
  }, [value, delay, setDebouncedValue]);

  return debouncedValue;
};

export default useDebounce;
