import React from "react";
import { useQuery } from "@tanstack/react-query";
import {  Typography } from "@mui/material";
import DataTable from "../../table/data-table";
import ActiveDeactive from "../active-deactive";
import usePaginate from "../../../hooks/usePaginate";
import SerialNumber from "../serial-number";
import {
  shopChemical,
} from "../../../http/server-api/server-apis";
import parse from "html-react-parser";

function ChemicalListResult(props: {
  searchText: string;

}) {
  const { page, setPage, size, setSize } = usePaginate();

  const { searchText } = props;

  const postfix = React.useMemo(() => {
    return searchText
      ? `${searchText}&page=${page}&size=${size}`
      : `?page=${page}&size=${size}`;
  }, [searchText, page, size]);

  const { isLoading,  data } = useQuery(
    ["chemicals", postfix],
    () =>
      shopChemical("get", {
        params: "chemicals",
        postfix,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "S No.",
        accessor: (_row: any, i: number) => i + 1,
        Cell: (cell: any) => (
          <SerialNumber cell={cell} page={page} size={size} />
        ),
        width: "5%",
      },
      {
        Header: "Chemical ID",
        accessor: "id",
        width: "8%",
      },
      {
        Header: "Status",
        accessor: "active",
        width: "10%",
        Cell: (cell: any) => <ActiveDeactive cell={cell} />,
      },
      {
        Header: "Chemical Name",
        accessor: "name",
        Cell: (cell: any) => (
          <Typography fontSize="small" textAlign="center">
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Safety Measures",
        accessor: "safety_measures",
        Cell: (cell: any) => (
          <Typography fontSize="small" textAlign="center">
            {parse(cell.value)}
          </Typography>
        ),
      },
    ],
    [postfix]
  );

  const getData = React.useMemo(() => {
    if (data?.status === 200) {
      return data.data;
    }
    return {
      chemicals: [],
    };
  }, [data]);

 
  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={getData?.chemicals || []}
        showNotFound={getData.chemicals?.length === 0}
      />
    </>
  );
}

export default React.memo(ChemicalListResult);
