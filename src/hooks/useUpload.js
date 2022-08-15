import React, { useRef, useCallback, useState } from 'react';

export default function useUploadFile(accept = '.json') {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [touched, setTouched] = useState(false);

  const triggerSelect = useCallback(() => {
    if (inputRef) {
      inputRef.current.click();
    }
  }, []);

  const handleChange = useCallback(
    e => {
      if (e.target?.files) {
        setFiles(e.target?.files);
        if (!touched) {
          setTouched(true);
        }
      }
    },
    [touched]
  );

  return {
    InputComponnent: (
      <input onChange={handleChange} ref={inputRef} type="file" accept={accept} hidden />
    ),
    triggerSelect,
    files,
    touched,
  };
}
