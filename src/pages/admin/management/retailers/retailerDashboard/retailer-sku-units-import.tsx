import React from "react";
import { useSnackbar } from "notistack";
import { Box, Button, CircularProgress } from "@mui/material";
import CommonToolbar from "../../../../../components/admin/common-toolbar";
import SerialNumber from "../../../../../components/admin/serial-number";
import { MainContainer } from "../../../../../components/layout";
import CSVFileReader from "../../../../../components/csv/csv-file-reader";
import PreviewTable from "../../../../../components/table/preview-table";
import CheckDataCell from "../../../../../components/table/cell/CheckDataCell";
import {
  retailer,
  shopAreas,
  shopAssignRetailerProducts,
} from "../../../../../http";
import { useNavigate, useParams } from "react-router-dom";
import {
  addSno,
  calculateMargin,
  dtypeValidation,
  price_id_validation,
  sale_price_validation,
  sku_id_validation,
} from "../../../../../components/admin/utils";
import SkuImportTemplate from "../../../../../csv-json-template/sku_import.json";
import { useQuery } from "@tanstack/react-query";
import { retailerSkuImportFields } from "../../../../../constants/fields/retailer-fields";
import { setPageLoading } from "../../../../../redux/slices/admin-slice";
import { useDispatch } from "react-redux";
import useStateWithCallback from "../../../../../hooks/useStateWithCallback";

export default function RetailerSkuImport() {
  const dispatch = useDispatch();
  const { retailer_id } = useParams();
  const reatailerResponse = useQuery(["retailer-name"], () =>
    retailer("get", { params: retailer_id })
  );
  const retailerName = React.useMemo(() => {
    if (reatailerResponse?.data?.status)
      return reatailerResponse.data.data?.retailer_name;
    return "";
  }, [reatailerResponse]);

  const ref = React.useRef<any>(null);
  const [loading, setLoading] = React.useState(false);
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
  Array<Record<string, any>>
>([]);
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
      { label: "sku_id", dtype: "number" },
      { label: "price_id", dtype: "number" },
      { label: "sale_price", dtype: "number" },
      { label: "margin", dtype: "string" },
      { label: "margin_amount", dtype: "number" },
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
        Header: "SKU ID",
        accessor: "sku_id",
        Cell: (cell: any) => (
          <CheckDataCell cell={cell} dtype="number" validate="sku_id" />
        ),
      },
      {
        Header: "Price ID",
        accessor: "price_id",
        Cell: (cell: any) => (
          <CheckDataCell cell={cell} dtype="number" validate="price_id" />
        ),
      },
      {
        Header: "Sale Price",
        accessor: "sale_price",
        Cell: (cell: any) => (
          <CheckDataCell cell={cell} dtype="number" validate="sale_price" />
        ),
      },
      {
        Header: "Margin",
        accessor: "margin",
        Cell: (cell: any) => (
          <CheckDataCell cell={cell} dtype="string"  />
        ),
      },
      {
        Header: "Margin Amount",
        accessor: "margin_amount",
        Cell: (cell: any) => (
          <CheckDataCell cell={cell} dtype="number"  />
        ),
      },
    ],
    []
  );

  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await shopAssignRetailerProducts("get", {
        params:  "unassign",
        postfix: `?retailer_id=${retailer_id}`,
      });
      if (res?.status === 200) {
        let csvData = res.data || [];
      
        csvData = calculateMargin(csvData)
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
    setLoading(true)
    let show = false;
    for (let index = 0; index < data.length; index++) {
      const row = data[index];
      for (const column of validateList) {
        const { error } = dtypeValidation(row[column.label], column.dtype);
        show = error;

        if (!show) {
          const { error } = await sku_id_validation(row.sku_id);
          show = error;
        }

        if (!show) {
          const { error } = await price_id_validation(row.price_id, row.sku_id);
          show = error;
        }
        if (!show) {
          const { error } = await sale_price_validation(
            row.sale_price,
            row.sku_id
          );
          show = error;
        }
      }
      if (show) {
        setLoading(false)
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
          let row = data[index];
          let addData = {
            retailer_id,
            margin: row.margin.includes("%") ? row.margin : row.margin + "%",
            margin_amount: `${row.margin_amount}`,
          };
          row = { ...row, ...addData };
          try {
            await shopAssignRetailerProducts("post", {
              data: JSON.stringify(row),
            });
          } catch (err: any) {
            console.log(err);
          }
        }
        navigate(-1);
        enqueueSnackbar(`Sku Assigned sucessfully.`, {
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
        title={`Import Sku for ${retailerName}`}
        exportProps={{
          ref,
          data: csvData,
          title: "Export Template",
          filename: "sku-import-csv",
          onClick: exportHandle,
          headers: retailerSkuImportFields,
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
