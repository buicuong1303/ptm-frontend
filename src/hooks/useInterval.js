import { useEffect, useRef } from 'react';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  //* save last callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  //* setup interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);

      return () => {
        clearInterval(id);
      };
    }
  }, [callback, delay]);
}

export default useInterval;
