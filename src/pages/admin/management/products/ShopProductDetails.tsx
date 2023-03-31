import React from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import {
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Grid,
  CardMedia,
} from "@mui/material";
// import { FaSave as SaveIcon } from "react-icons/fa";
import { AiFillPrinter as PrintIcon } from "react-icons/ai";
import { MainContainer } from "../../../../components/layout";
import {
  shopProductImages,
  // shopProductImages,
  shopProducts,
  shopProductWeightPrice,
} from "../../../../http";
import usePrintData from "../../../../hooks/usePrintData";
import SpeedDialTooltipAction from "../../../../components/admin/speed-dial-tooltip-action";
// import { reactToPdf } from "../../../../components/admin/utils";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import ShopAvatar from "../../../../components/Image/shop-avatar";
import parse from "html-react-parser";

const productLabels = [
  { label: "SKU Name", accessor: "sku_name" },
  { label: "SKU Name Kannada", accessor: "sku_name_kannada" },
  { label: "SKU Code", accessor: "sku_code" },
  { label: "Category", accessor: "category_name" },
  { label: "Sub Category", accessor: "subcategory_name" },
  { label: "Brand", accessor: "brand_name" },
  { label: "HSN Code", accessor: "hsn_code" },
];

const productPriceLabels = [
  {
    label: "Price",
    accessor: "price",
    Cell: (cell: any) => <>₹{cell.value}</>,
  },
  { label: "MRP", accessor: "mrp", Cell: (cell: any) => <>₹{cell.value}</> },
  { label: "IGST", accessor: "igst" },
  { label: "CGST", accessor: "cgst" },
  { label: "SGST", accessor: "sgst" },
  { label: "Fragile", accessor: "fragile" },
  { label: "Weight", accessor: "weight" },
  { label: "Actual Weight", accessor: "totalweight" },
  { label: "Package", accessor: "package_name" },
  { label: "Units Per Case", accessor: "units_per_case" },
  { label: "Volume", accessor: "dimension" },
];

export default function ShopProductDetails() {
  const { sku_id } = useParams();
  const [productData, setProductData] = React.useState<Record<string, any>>({});
  const [productPriceData, setProductPriceData] = React.useState<
    Record<string, any>
  >({});
  const [productImageData, setProductImageData] = React.useState<Array<any>>(
    []
  );
  let componentRef = React.useRef<any>(null);

  const { printData: obj1 } = usePrintData({
    labels: productLabels,
    data: productData,
  });

  const { printData: obj2 } = usePrintData({
    labels: productPriceLabels,
    data: productPriceData,
  });

  const getData = async () => {
    try {
      let res = await shopProducts("get", { params: sku_id });

      if (res?.status === 200) {
        setProductData(res.data[0]);
      }
      res = await shopProductWeightPrice("get", {
        postfix: `?sku_id=${sku_id}`,
      });

      if (res?.status === 200) {
        setProductPriceData(res.data[0] || {});
      }

      const imgres = await shopProductImages("get", {
        postfix: `?sku_id=${sku_id}`,
      });

      if (imgres?.status === 200) {
        setProductImageData(imgres.data);
      }
    } catch (err: any) {
      console.log(err?.response);
    }
  };

  const pageStyle = `
  @media all {
    .page-break {
      display: none;
    }
  }
  
  @media print {
    html, body {
      height: initial !important;
      overflow: initial !important;
      -webkit-print-color-adjust: exact;
    }
    body {
      -webkit-filter: grayscale(100%);
      -moz-filter: grayscale(100%);
      -ms-filter: grayscale(100%);
      filter: grayscale(100%);
    }
  }
  
  @media print {
    .page-break {
      margin-top: 1rem;
      display: block;
      page-break-before: auto;
    }
  }
  
  @page {
    size: auto;
    margin: 20mm;
  }
`;
  const onPrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: pageStyle,
  });

  const actions = React.useMemo(
    () => [
      // {
      //   icon: <SaveIcon size={20} />,
      //   name: "Save",
      //   onClick: () =>
      //     reactToPdf(componentRef.current, "product-details-pdf.pdf"),
      // },
      { icon: <PrintIcon size={20} />, name: "Print", onClick: onPrint },
    ],
    []
  );

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <MainContainer>
        <Container>
          <CommonToolbar title={`${productData?.sku_name} / Product Details`} />
          <Box
            display={"flex"}
            flexDirection={"column"}
            gap={2}
            component="div"
            ref={componentRef}
          >
            {/* Card One */}
            <Card
              sx={{
                display: "flex",
                maxHeight: 360,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShopAvatar
                src={productData?.image_url}
                sx={{ height: "100%", width: "40%" }}
                defaultImg={{
                  variant: "rounded",
                  sx: {
                    height: 150,
                    width: 150,
                  },
                }}
                variant="square"
                download
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: 350,
                  overflow: "auto",
                }}
              >
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    View Product
                  </Typography>
                  <Grid container>
                    {obj1.map((item, index) => {
                      return (
                        <Grid key={index} item xs={12}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            textAlign={"justify"}
                          >
                            <strong>{item.get("label")}: </strong>
                            {item.get("Cell")}
                          </Typography>
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Box>
            </Card>
            {/* Card Two */}

            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Product Price
                </Typography>
                <Grid container>
                  {obj2.map((item, index) => {
                    if (item.get("label") === "Actual Weight") {
                      return item.get("Cell").props.children > 0 ? (
                        <Grid key={index} item xs={12}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            textAlign={"justify"}
                          >
                            <strong>{item.get("label")}: </strong>
                            {item.get("Cell").props.children < 999 ? (
                              <>{item.get("Cell")}gm</>
                            ) : (
                              <>{item.get("Cell").props.children / 1000}Kg</>
                            )}
                          </Typography>
                        </Grid>
                      ) : null;
                    }

                    if (item.get("label") === "Dimensions") {
                      return item.get("Cell").props.children > 0 ? (
                        <Grid key={index} item xs={12}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            textAlign={"justify"}
                          >
                            <strong>{item.get("label")}: </strong>
                            {item.get("Cell")} cm<sup>3</sup>
                          </Typography>
                        </Grid>
                      ) : null;
                    }

                    return (
                      <Grid key={index} item xs={6}>
                        {item.get("Cell") ? (
                          item.get("label") == "Fragile" ? (
                            <Typography variant="body2" color="text.secondary">
                              <strong>{item.get("label")}: </strong>
                              {item.get("Cell").props.children == 1
                                ? "Yes"
                                : "No"}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              <strong>{item.get("label")}: </strong>
                              {item.get("Cell")}
                            </Typography>
                          )
                        ) : null}
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
            {/* Card three */}

            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Description
                </Typography>
                <Grid container>
                  <Grid item>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Description: </strong>
                      {parse(
                        productData?.description
                          ? `${productData.description}`
                          : ""
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            {/* Card four */}

            {productImageData?.length !== 0 && (
              <Card>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Product Images
                  </Typography>
                  <Grid container spacing={2}>
                    {productImageData.map((item, index) => (
                      <Grid key={index} item xs={3}>
                        <Card
                          elevation={5}
                          sx={{
                            display: "flex",
                            p: 2,
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Typography px={1} gutterBottom component="div">
                            {item.title}
                          </Typography>
                          <ShopAvatar
                            src={item?.image}
                            sx={{ height: "100%", width: "40%" }}
                            defaultImg={{
                              variant: "rounded",
                              sx: {
                                height: 150,
                                width: 150,
                              },
                            }}
                            variant="square"
                            download
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Box>
        </Container>
      </MainContainer>
      <SpeedDialTooltipAction actions={actions} />
    </>
  );
}
