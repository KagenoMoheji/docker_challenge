import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const useQueryStrings = (): URLSearchParams => {
  /*
  - Refs
    - https://v5.reactrouter.com/web/example/query-parameters
  */
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};
