import React from "react";
import { useSnackbar } from "notistack";
import { Box, Button, CircularProgress } from "@mui/material";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import SerialNumber from "../../../../components/admin/serial-number";
import { MainContainer } from "../../../../components/layout";
import CSVFileReader from "../../../../components/csv/csv-file-reader";
import PreviewTable from "../../../../components/table/preview-table";
import CheckDataCell from "../../../../components/table/cell/CheckDataCell";
import { brands, crops, shopAreas } from "../../../../http";
import { useNavigate } from "react-router-dom";
import { dtypeValidation } from "../../../../components/admin/utils";
import CropTemplate from "../../../../csv-json-template/crop.json";

export default function CropCsvImport() {
  const ref = React.useRef<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<Array<Record<string, any>>>([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const validateList = React.useMemo<
    Array<{
      label: string;
      dtype: "string" | "number";
    }>
  >(
    () => [
      { label: "crop_name", dtype: "string" },
      { label: "image", dtype: "string" },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "S No.",
        accessor: (_row: any, i: number) => i + 1,
        Cell: (cell: any) => <SerialNumber cell={cell} page={0} size={"1"} />,
        width: "5.5%",
      },
      {
        Header: "Crop Name",
        accessor: "crop_name",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="string" />,
      },
      {
        Header: "Crop Image",
        accessor: "image",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="string" />,
      },
    ],
    []
  );

  const exportHandle = () => ref.current.link.click();
  const onRead = (data: Array<Record<string, any>>) => setData(data);

  const updateMyData = (rowIndex: number, columnId: string, value: any) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const onUpload = async () => {
    let show = false;
    for (let index = 0; index < data.length; index++) {
      const row = data[index];
      for (const column of validateList) {
        const { error } = dtypeValidation(row[column.label], column.dtype);
        show = error;
      }
      if (show) {
        enqueueSnackbar(`please check S No. ${index + 1}`, {
          variant: "error",
        });
        break;
      }
    }
    if (!show) {
      try {
        setLoading(true);
        for (let index = 0; index < data.length; index++) {
          const row = data[index];

          try {
            await crops("post", {
              data: JSON.stringify({
                crop_name: row.crop_name,
                image: row.image,
              }),
            });
          } catch (err: any) {
            console.log(err);
          }
        }
        navigate(-1);
        enqueueSnackbar(`Crop csv upload successfully.`, {
          variant: "success",
        });
      } catch (error) {
        console.log(error);
      }
    }
    setLoading(false);
  };

  return (
    <MainContainer>
      <CommonToolbar
        title="Import CSV Crop"
        exportProps={{
          ref,
          data: CropTemplate,
          title: "Export Template",
          filename: "crop-template-csv",
          onClick: exportHandle,
        }}
      />
      <Box my={1}>
        <CSVFileReader setFile={onRead} />
      </Box>
      <Box sx={{ mt: 1 }}>
        <PreviewTable
          columns={columns}
          data={data || []}
          showNotFound={data.length === 0}
          updateMyData={updateMyData}
        />
      </Box>
      <Button
        sx={{ mt: 2 }}
        color="secondary"
        size="small"
        variant="contained"
        onClick={onUpload}
        disabled={data.length > 0 ? loading : true}
        startIcon={
          loading ? <CircularProgress color="inherit" size={18} /> : undefined
        }
      >
        Upload
      </Button>
    </MainContainer>
  );
}
