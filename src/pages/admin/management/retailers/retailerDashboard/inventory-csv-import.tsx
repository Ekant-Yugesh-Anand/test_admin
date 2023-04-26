import React from "react";
import { useSnackbar } from "notistack";
import { Box, Button, CircularProgress } from "@mui/material";
import SerialNumber from "../../../../../components/admin/serial-number";
import { useNavigate, useParams } from "react-router-dom";
import CheckDataCell from "../../../../../components/table/cell/CheckDataCell";
import {
  dtypeValidation,
  usedQuantityValidation,
} from "../../../../../components/admin/utils";
import {
  shopAssignRetailerProducts,
  shopRetailerProductPrice,
} from "../../../../../http";
import { MainContainer } from "../../../../../components/layout";
import CommonToolbar from "../../../../../components/admin/common-toolbar";
import CSVFileReader from "../../../../../components/csv/csv-file-reader";
import PreviewTable from "../../../../../components/table/preview-table";
import { useDispatch } from "react-redux";
import { setPageLoading } from "../../../../../redux/slices/admin-slice";
import useStateWithCallback from "../../../../../hooks/useStateWithCallback";
import { retailerInventoryImportFields } from "../../../../../constants/fields/retailer-fields";

export default function InventoryCsvImport() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { retailer_id } = useParams();
  const ref = React.useRef<any>(null);
  const [loading, setLoading] = React.useState(false);
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const [data, setData] = React.useState<Array<Record<string, any>>>([]);
  const { enqueueSnackbar } = useSnackbar();

  const validateList = React.useMemo<
    Array<{
      label: string;
      dtype: "string" | "number";
    }>
  >(
    () => [
      { label: "price_id", dtype: "number" },
      { label: "sku_name", dtype: "string" },
      { label: "quantity", dtype: "number" },
      { label: "used_quantity", dtype: "number" },
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
      },  {
        Header: "Sku Id",
        accessor: "sku_id",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" />,
      },
      {
        Header: "Price Id",
        accessor: "price_id",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" />,
      },
      {
        Header: "Sku Name",
        accessor: "sku_name",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="string" />,
      },
      {
        Header: "Quantity",
        accessor: "quantity",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" />,
      },
      {
        Header: "Used Quantity",
        accessor: "used_quantity",
        Cell: (cell: any) => (
          <CheckDataCell cell={cell} dtype="number" validate="used_quantity" />
        ),
      },
    ],
    []
  );

  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await shopAssignRetailerProducts("get", {
        postfix: `?retailer_id=${retailer_id}`,
      });
      if (res?.status === 200) {
        console.log(res.data);
        let csvData = res.data || [];

        setCsvData(csvData, () => {
          ref.current.link.click();
          dispatch(setPageLoading(false));
        });
      }
    } catch (error) {
      console.log(error);
      dispatch(setPageLoading(false));
    }
  };
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
        if (!show) {
          const { error } = usedQuantityValidation(
            row.quantity,
            row.used_quantity,
            
          );
          show = error;
        }
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
            await shopRetailerProductPrice("put", {
              params: row.price_id,
              data: JSON.stringify({
                quantity: row.quantity,
                used_quantity: row.used_quantity,
                sku_id:row.sku_id,
                retailer_id
              }),
            });
          } catch (err: any) {
            console.log(err);
          }
        }
        navigate(-1);
        enqueueSnackbar(`Inventory Updated successfully.`, {
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
        title="Import Inventory Data"
        exportProps={{
          ref,
          data: csvData,
          title: "Export Template",
          filename: "inventory-template-csv",
          onClick: exportHandle,
          headers: retailerInventoryImportFields,
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
