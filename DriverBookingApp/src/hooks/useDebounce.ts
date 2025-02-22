import {useEffect, useState} from 'react';

// Hook useDebounce để trì hoãn giá trị
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler); // Xoá timeout khi giá trị thay đổi
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
