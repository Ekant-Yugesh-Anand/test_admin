import React from "react";
import { useLocation } from "react-router-dom";

const cachePage: Map<string, number> = new Map();
const cacheSize: Map<string, string> = new Map();

const getPrevPage = (defaultPage: number, url: string) => {
  if (cachePage.has(url)) {
    return cachePage.get(url) as number;
  }
  return defaultPage;
};

const getPrevSize = (defaultSize: string, url: string) => {
  if (cacheSize.has(url)) {
    return cacheSize.get(url) as string;
  }
  return defaultSize;
};

export default function usePaginate(
  defaultPage = 0,
  defaultSize = "10",
  pageName = ""
) {
  const location = useLocation();

  const url = React.useMemo(
    () => `${location.pathname}/${pageName}`,
    [pageName]
  );

  const [page, setPage] = React.useState(getPrevPage(defaultPage, url));
  const [size, setSize] = React.useState(getPrevSize(defaultSize, url));

  const setCurrPage = (value: number) => {
    cachePage.set(url, value);
    setPage(value);
  };

  const setCurrSize = (value: string) => {
    cacheSize.set(url, value);
    setSize(value);
  };

  return { page, size, setPage: setCurrPage, setSize: setCurrSize };
}
