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
import {  shopProducts } from "../../../../http";
import { useNavigate } from "react-router-dom";
import { brandValidation, categoryValidation, cropValidation, dtypeValidation, getBrand, getCategory, getPackage, getSubCategory, gstValidation, ingredientValidation, packageValidation, priceValidation, subCategoryValidation, wieghtValidation } from "../../../../components/admin/utils";
// import CheckVerifiedCategoryCell from "../../../../components/table/cell/CheckVerifiedCategoryCell";
// import CheckVerifiedSubCategoryCell from "../../../../components/table/cell/CheckVerifiedSubCategoryCell";
// import CheckVerifiedBrandCell from "../../../../components/table/cell/CheckVerifiedBrandCell";
// import CheckVerifiedPackageCell from "../../../../components/table/cell/CheckVerifiedPackageCell";

export default function ProductCsvImport() {
  const ref = React.useRef<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<Array<Record<string, any>>>([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const validateList =
    React.useMemo<
      Array<{
        label: string;
        dtype: "string" | "number" | "both";
      }>>(
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
          // { label: "package_weight", dtype: "string" },
          { label: "units_per_case", dtype: "number" },
          { label: "dimension_length", dtype: "number" },
          { label: "dimension_width", dtype: "number" },
          { label: "dimension_height", dtype: "number" },
          // { label: "dimension", dtype: "number" },
          { label: "totalweight", dtype: "number" },
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
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="string" />,
      },


      {
        Header: "SKU Code",
        accessor: "sku_code",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="string" />,
      },
      // {
      //   Header: "Category",
      //   accessor: "category",
      //   Cell: (cell: any) => <CheckVerifiedCategoryCell cell={cell} dtype="string" />,
      // },
      {
        Header: "Category",
        accessor: "category_id",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" validate="category" />,
      },
      // {
      //   Header: "Sub Category",
      //   accessor: "subcategory",
      //   Cell: (cell: any) => <CheckVerifiedSubCategoryCell cell={cell} dtype="string" />,
      // },
      {
        Header: "Sub Category",
        accessor: "subcategory_id",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" validate="subCategory" />,
      },
      // {
      //   Header: "Brand",
      //   accessor: "brand",
      //   Cell: (cell: any) => <CheckVerifiedBrandCell cell={cell} dtype="string" />,
      // },
      {
        Header: "Brand",
        accessor: "brand_id",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" validate="brand" />,
      },
      {
        Header: "Crop",
        accessor: "crop_id",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="both" validate="crop" />,
      },
      {
        Header: "Ingredients",
        accessor: "ingredient_id",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="both" validate="ingredient" />,
      },
      {
        Header: "Hsn Code",
        accessor: "hsn_code",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number"  />,
      },
      {
        Header: "MRP",
        accessor: "mrp",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" />,
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" validate="price" />,
      },
      {
        Header: "Gst",
        accessor: "gst",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="string" validate="gst" />,
      },
      {
        Header: "Weight",
        accessor: "weight",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="string" validate="weight" />,
      },
      // {
      //   Header: "Package",
      //   accessor: "package",
      //   Cell: (cell: any) => <CheckVerifiedPackageCell cell={cell} dtype="string" />,
      // },
      {
        Header: "Package",
        accessor: "package",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" validate="package" />,
      },
      {
        Header: "Fragile",
        accessor: "fragile",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" />,
      },
      // {
      //   Header: "Package Weight",
      //   accessor: "package_weight",
      //   Cell: (cell: any) => <CheckDataCell cell={cell} dtype="string"  />,
      // },
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
    
      // {
      //   Header: "Dimension",
      //   accessor: "dimension",
      //   Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" />,
      // },
      {
        Header: "Total Weight",
        accessor: "totalweight",
        Cell: (cell: any) => <CheckDataCell cell={cell} dtype="number" />,
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
    setLoading(true);
    for (let index = 0; index < data.length; index++) {
      const row = data[index];

      for (const column of validateList) {
        const { error } = dtypeValidation(
          row[column.label],
          column.dtype
        );
        show = error;
        if (!show) {
          const { error } = priceValidation(row.mrp, row.price)
          show = error
        }

        if (!show) {
          const { error } = gstValidation(row.gst)
          show = error
        }

      }

      let cat_valid = await categoryValidation(row.category_id)
      let sub_cat_valid = await subCategoryValidation(row.subcategory_id)
      let brand_valid = await brandValidation(row.brand_id)
      let package_valid = await packageValidation(row.package)
      let crop_valid = await cropValidation(row.crop_id)
      let ingredient_valid = await ingredientValidation(row.ingredient_id)
      let weight_valid = wieghtValidation(row.weight)
      
      if (!show) {
        if (cat_valid.error || sub_cat_valid.error || brand_valid.error || package_valid.error || weight_valid.error || crop_valid.error || ingredient_valid.error) {
          show = true
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
            dimension: +row.dimension_length * +row.dimension_width * +row.dimension_height
          }

          row = { ...row, ...calValue }

          await shopProducts("post", {
            params: "import",
            data: JSON.stringify(row),
          });

          // to get category subcategory name wise

          // let category_id = await getCategory(row.category)

          // let subcategory_id = await getSubCategory(row.subcategory, category_id)
          // let brand_id = await getBrand(row.brand)
          // let packages_id = await getPackage(row.package)

          // if (category_id && subcategory_id && brand_id && packages_id
          // ) {
          //   let id_value = {
          //     category_id: category_id,
          //     subcategory_id: subcategory_id,
          //     brand_id: brand_id,
          //     package: packages_id,
          //     totalweight: row.actualweight,
          //     igst: row.gst,
          //     cgst: `${row.gst.split("%")[0] / 2}%`,
          //     sgst: `${row.gst.split("%")[0] / 2}%`


          //   }
          //   row = { ...row, ...id_value }
          //   try {
          //     await shopProducts("post", {
          //       params: "import",
          //       data: JSON.stringify(row),
          //     });

          //   } catch (err: any) {
          //     console.log(err);
          //   }
          // }
        }
        navigate(-1)
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
    <MainContainer>
      <CommonToolbar
        title="Import CSV Product"
        exportProps={{
          ref,
          data: ProductTemplate,
          title: "Export Template",
          filename: "product-template-csv",
          onClick: exportHandle,
        }}
      />
      <Box my={1}>
        <CSVFileReader setFile={onRead} />
      </Box>
      <CommonToolbar title="csv data preview" titleVariant="subtitle" />
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
        disabled={loading}
        //  disabled={true}
        startIcon={
          loading ? <CircularProgress color="inherit" size={18} /> : undefined
        }
      >
        Upload
      </Button>
    </MainContainer>
  );
}

