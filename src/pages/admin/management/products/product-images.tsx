import React from "react";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import { MainContainer } from "../../../../components/layout";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import ProductListImages from "../../../../components/admin/products/product-list-images";
import { useQuery } from "@tanstack/react-query";
import { shopProducts } from "../../../../http";

export default function ProductImages() {
  const { sku_id } = useParams();
  const [open, setOpen] = React.useState(false);

  const onUpload = () => setOpen(true);
  const onClose = () => setOpen(false);

  const { data } = useQuery(["get-sku-name"], () =>
    shopProducts("get", { params: sku_id })
  );

  const skuName = React.useMemo(() => {
    if (data?.status) return data.data[0]?.sku_name;
    return "";
  }, [data]);

  return (
    <MainContainer>
      <CommonToolbar
        title={`${skuName} / Product Images `}
        onAddProps={{
          title: "Add Product Image",
          onClick: onUpload,
        }}
      />
      <Box sx={{ mt: 3 }}>
        <ProductListImages
          sku_id={sku_id as string}
          uploadOpen={open}
          uploadClose={onClose}
        />
      </Box>
    </MainContainer>
  );
}
