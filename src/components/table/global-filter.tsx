import React from "react";
import { useAsyncDebounce } from "react-table";
import RowSearch from "./row-search";

export default function GlobalFilter(props: {
  preGlobalFilteredRows: any;
  globalFilter: any;
  setGlobalFilter: any;
}) {
  const { preGlobalFilteredRows, globalFilter, setGlobalFilter } = props;
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);
  return (
    <RowSearch
      value={value || ""}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={`${count} records...`}
    />
  );
}
