import React from "react";
import { Tooltip, Button } from "@mui/material";
import { CSVLink } from "react-csv";
import { FaFileCsv } from "react-icons/fa";
import { Cell } from "react-table";
import useStateWithCallback from "../../../../hooks/useStateWithCallback";
import { retailerReportFields } from "../../../../constants";

export default function RetailerReportExport(props: { cell: Cell }) {
  const { cell } = props;
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);

  const onExport = (data: Array<Record<string, any>> = []) => {
    setCsvData(data, () => {
      ref.current.link.click();
    });
  };

  return (
    <>
      <CSVLink
        data={csvData}
        headers={retailerReportFields}
        filename="retailer-report-csv"
        target="_blank"
        ref={ref}
      />
      <Tooltip title="Export from CSV">
        <Button
          disableRipple={false}
          size="small"
          color="secondary"
          startIcon={<FaFileCsv fontSize="small" />}
          sx={{
            mr: 1,
          }}
          onClick={() =>
            onExport([
              {
                s_no: cell.row.values["S No."],
                ...cell.row.original,
              },
            ])
          }
        >
          Export
        </Button>
      </Tooltip>
    </>
  );
}
