import React from "react";
import { useSnackbar } from "notistack";
import { Box, Button, CircularProgress } from "@mui/material";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import SerialNumber from "../../../../components/admin/serial-number";
import { MainContainer } from "../../../../components/layout";
import ProductTemplate from "../../../../csv-json-template/products.json";
import CSVFileReader from "../../../../components/csv/csv-file-reader";
import PreviewTable from "../../../../components/table/preview-table";
import CheckDataCell from "../../../../components/table/cell/CheckDataCell";
import { shopProducts } from "../../../../http";
import { useNavigate } from "react-router-dom";
import {
  addSno,
  brandValidation,
  categoryValidation,
  cropValidation,
  dtypeValidation,
  gstValidation,
  ingredientValidation,
  packageValidation,
  priceValidation,
  subCategoryValidation,
  wieghtValidation,
} from "../../../../components/admin/utils";
import ProductImportTab from "../../../../components/admin/products/product-import-tab";
import useStateWithCallback from "../../../../hooks/useStateWithCallback";
import { useDispatch } from "react-redux";
import { setPageLoading } from "../../../../redux/slices/admin-slice";
import { productImportField } from "../../../../constants";

export default function ProductCsvImport() {
  const ref = React.useRef<any>(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<Array<Record<string, any>>>([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [importTab, setImportTab] = React.useState(0);
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);

  const validateList = React.useMemo<
    Array<{
      label: string;
      dtype: "string" | "number" | "both";
    }>
  >(
    () => [
      { label: "sku_name", dtype: "string" },
      { label: "sku_name_kannada", dtype: "string" },
      { label: "description", dtype: "string" },
      { label: "ingredients", dtype: "string" },
      { label: "sku_code", dtype: "string" },
      { label: "category_id", dtype: "number" },
      { label: "subcategory_id", dtype: "number" },
      { label: "brand_id", dtype: "number" },
      { label: "crop_id", dtype: "both" },
      { label: "ingredient_id", dtype: "both" },
      { label: "hsn_code", dtype: "number" },
      { label: "mrp", dtype: "number" },
      { label: "price", dtype: "number" },
      { label: "gst", dtype: "string" },
      { label: "weight", dtype: "string" },
      { label: "package", dtype: "number" },
      { label: "fragile", dtype: "number" },
      { label: "units_per_case", dtype: "number" },
      { label: "dimension_length", dtype: "number" },
      { label: "dimension_width", dtype: "number" },
      { label: "dimension_height", dtype: "number" },
      { label: "totalweight", dtype: "number" },
    ],
    []
  );

  const getSkuID = () => {
    if (importTab == 1)
      return [
        {
          Header: "SKU ID.",
          accessor: "sku_id",
          width: "5.5%",
        },
      ];
    return [];
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "S No.",
        accessor: (_row: any, i: number) => i + 1,
        Cell: (cell: any) => <SerialNumber cell={cell} page={0} size={"1"} />,
        width: "5.5%",
      },
      ...getSkuID(),
      {
        Header: "SKU Name",
        accessor: "sku_name",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="string" />,
      },
      {
        Header: "SKU Name Kannada",
        accessor: "sku_name_kannada",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="string" />,
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="string" />,
      },

      {
        Header: "Ingredients",
        accessor: "ingredients",
      },
      {
        Header: "Technical Formula",
        accessor: "technical_formula",
      },
      {
        Header: "Doses",
        accessor: "doses",
      },
      {
        Header: "Application",
        accessor: "application",
      },
      {
        Header: "Target Crop",
        accessor: "target_crop",
      },

      {
        Header: "SKU Code",
        accessor: "sku_code",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="string" />,
      },
      {
        Header: "Category",
        accessor: "category_id",
        Cell: (cell: any) => (
          <CheckDataCell cell={cell} dtype="number" validate="category" />
        ),
      },
      {
        Header: "Sub Category",
        accessor: "subcategory_id",
        Cell: (cell: any) => (
          <CheckDataCell cell={cell} dtype="number" validate="subCategory" />
        ),
      },
      {
        Header: "Brand",
        accessor: "brand_id",
        Cell: (cell: any) => (
          <CheckDataCell cell={cell} dtype="number" validate="brand" />
        ),
      },
      {
        Header: "Crop",
        accessor: "crop_id",
        Cell: (cell: any) => (
          <CheckDataCell cell={cell} dtype="both" validate="crop" />
        ),
      },
      {
        Header: "Ingredients",
        accessor: "ingredient_id",
        Cell: (cell: any) => (
          <CheckDataCell cell={cell} dtype="both" validate="ingredient" />
        ),
      },
      {
        Header: "Chemicals",
        accessor: "chemical_id",
        Cell: (cell: any) => (
          <CheckDataCell cell={cell} dtype="both"  />
        ),
      },
      {
        Header: "Hsn Code",
        accessor: "hsn_code",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" />,
      },
      {
        Header: "MRP",
        accessor: "mrp",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" />,
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: (cell: any) => (
          <CheckDataCell cell={cell} dtype="number" validate="price" />
        ),
      },
      {
        Header: "Gst",
        accessor: "gst",
        Cell: (cell: any) => (
          <CheckDataCell cell={cell} dtype="string" validate="gst" />
        ),
      },
      {
        Header: "Weight",
        accessor: "weight",
        Cell: (cell: any) => (
          <CheckDataCell cell={cell} dtype="string" validate="weight" />
        ),
      },
      {
        Header: "Package",
        accessor: "package",
        Cell: (cell: any) => (
          <CheckDataCell cell={cell} dtype="number" validate="package" />
        ),
      },
      {
        Header: "Fragile",
        accessor: "fragile",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" />,
      },
      {
        Header: "Units per case",
        accessor: "units_per_case",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" />,
      },
      {
        Header: "Length",
        accessor: "dimension_width",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" />,
      },
      {
        Header: "Width",
        accessor: "dimension_length",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" />,
      },
      {
        Header: "Height",
        accessor: "dimension_height",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" />,
      },
      {
        Header: "Total Weight",
        accessor: "totalweight",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" />,
      },
    ],
    [importTab]
  );

  const exportHandle = async () => {
    if (importTab == 0) return ref.current.link.click();

    try {
      dispatch(setPageLoading(true));
      const res = await shopProducts("get", {});
      if (res?.status === 200) {
        let csvData = res.data || [];
        // indexing
        csvData = addSno(csvData);

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
    setLoading(true);
    for (let index = 0; index < data.length; index++) {
      const row = data[index];

      for (const column of validateList) {
        const { error } = dtypeValidation(row[column.label], column.dtype);
        show = error;
        if (!show) {
          const { error } = priceValidation(row.mrp, row.price);
          show = error;
        }

        if (!show) {
          const { error } = gstValidation(row.gst);
          show = error;
        }
      }

      let cat_valid = await categoryValidation(row.category_id);
      let sub_cat_valid = await subCategoryValidation(row.subcategory_id);
      let brand_valid = await brandValidation(row.brand_id);
      let package_valid = await packageValidation(row.package);
      let crop_valid = await cropValidation(row.crop_id);
      let ingredient_valid = await ingredientValidation(row.ingredient_id);
      let weight_valid = wieghtValidation(row.weight);

      if (!show) {
        if (
          cat_valid.error ||
          sub_cat_valid.error ||
          brand_valid.error ||
          package_valid.error ||
          weight_valid.error ||
          crop_valid.error ||
          ingredient_valid.error
        ) {
          show = true;
        }
      }
      if (show) {
        setLoading(false);
        enqueueSnackbar(`please check S No. ${index + 1}`, {
          variant: "error",
        });
        break;
      }
    }
    if (!show) {
      try {
        for (let index = 0; index < data.length; index++) {
          let row = data[index];
          let calValue = {
            igst: row.gst,
            cgst: `${row.gst.split("%")[0] / 2}%`,
            sgst: `${row.gst.split("%")[0] / 2}%`,
            dimension:
              +row.dimension_length *
              +row.dimension_width *
              +row.dimension_height,
              crop_id:`${row.crop_id}`,
              ingredient_id:`${row.ingredient_id}`,
              chemical_id:`${row.chemical_id}`,
           
          };

          row = { ...row, ...calValue };

          importTab == 0
            ? await shopProducts("post", {
                params: "import",
                data: JSON.stringify(row),
              })
            : await shopProducts("put", {
                params: row.sku_id,
                data: JSON.stringify(row),
              });
        }
        navigate(-1);
        enqueueSnackbar(`product csv upload successfully.`, {
          variant: "success",
        });
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <ProductImportTab onChange={setImportTab} value={importTab} />
      <Box mt={10}>
        <MainContainer>
          <CommonToolbar
            title={
              importTab == 0 ? "Import New Product" : "Update Existing Product"
            }
            exportProps={{
              ref,
              data: importTab == 0 ? ProductTemplate : csvData,
              title: "Export Template",
              filename:
                importTab == 0
                  ? "product-template-csv.csv"
                  : "Existing-product-data.csv",
              onClick: exportHandle,
              headers: importTab == 0 ? undefined : productImportField,
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
              loading ? (
                <CircularProgress color="inherit" size={18} />
              ) : undefined
            }
          >
            Upload
          </Button>
        </MainContainer>
      </Box>
    </>
  );
}
