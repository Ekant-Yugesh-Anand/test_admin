import { useState, useRef, useEffect, useCallback } from "react";

const useStateWithCallback = <T>(initialState: T) => {
  const [state, setState] = useState<T>(initialState);
  const cbRef = useRef<any>(null);

  const updateState = useCallback((newState: T, cb?: Function) => {
    cbRef.current = cb;

    setState((prev: any) =>
      typeof newState === "function" ? newState(prev) : newState
    );
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return { state, updateState };
};

export default useStateWithCallback;
