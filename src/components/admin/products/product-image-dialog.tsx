import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tabs,
  Tab,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";
import useBucket from "../../../hooks/useBucket";
import { shopProductImages } from "../../../http";
import { TextInput } from "../../form";
import FileUploader from "../../form/inputs/file-uploader";
import ImageView from "../../Image/image-view";

export default function ProductImageDialog(props: {
  open: boolean;
  close: () => void;
  productImageData: Record<string, any> | null;
  reload: () => void;
  skuId: string;
}) {
  const { open, close, productImageData, reload, skuId } = props;
  const [file, setFile] = React.useState<File>(productImageData?.image);
  const [data, setData] = React.useState<{ [key: string]: any }>({
    title: productImageData?.title || "",
    image: productImageData?.image || "",
  });
  const [uploadType, setUploadType] = React.useState("single");
  const [bulkFile, setBulkFile] = React.useState<File[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { imgUploader } = useBucket();
  const { enqueueSnackbar } = useSnackbar();

  const onUpload = async () => {
    // if (productImageData) {
    //   try {
    //     setLoading(true);
    //     const metadata: any = await imgUploader(file)

    //     if (metadata) {
    //       // upload data in server
    //       const res = await shopProductImages("put", {
    //         params: productImageData?.image_id,
    //         data: JSON.stringify({
    //           ...data,
    //           sku_id: skuId,
    //           image: metadata.image,
    //         }),
    //       });
    //       // uploading finish return true
    //       if (res?.status === 200) {
    //         close();
    //         setTimeout(
    //           () =>
    //             enqueueSnackbar("Product Image Update  successfully!👍😊", {
    //               variant: "success",
    //             }),
    //           2000
    //         );
    //         reload();
    //       }
    //     }
    //   } catch (error) {
    //     enqueueSnackbar("Product Image Update Failed!😢", {
    //       variant: "error",
    //     });
    //   }
    // } else {

    if (uploadType == "single") {
      try {
        setLoading(true);
        const metadata: any = await imgUploader(file as File);
        if (metadata) {
          // upload data in server
          const res = await shopProductImages("post", {
            data: JSON.stringify({
              title: data.title ? data.title : file.name,
              sku_id: skuId,
              image: metadata.image,
            }),
          });
          // uploading finish return true
          if (res?.status === 200) {
            close();
            setTimeout(
              () =>
                enqueueSnackbar("Product Image Add  successfully!👍😊", {
                  variant: "success",
                }),
              2000
            );
            reload();
          }
        }
      } catch (error) {
        enqueueSnackbar("Product Image Add Failed!😢", {
          variant: "error",
        });
      }
    } else {
      setLoading(true);
      try {
        bulkFile.map(async (file, index) => {
          const metadata: any = await imgUploader(file as File);
          if (metadata) {
            const res = await shopProductImages("post", {
              data: JSON.stringify({
                title: file.name,
                sku_id: skuId,
                image: metadata.image,
              }),
            });

            if (res?.status === 200) {
              setTimeout(
                () =>
                  enqueueSnackbar("Product Image Add  successfully!👍😊", {
                    variant: "success",
                  }),
                2000
              );
            }
            if (index == bulkFile.length - 1) {
              close();
              reload();
            }
          }
        });
      } catch (error) {
        setLoading(false);
        enqueueSnackbar("Product Images could not added", {
          variant: "error",
        });
      }
    }
    // }
  };

  const handleMultiple = (file: any) => {
    for (let i = 0; i < file?.length; i++) {
      setBulkFile((prev) => [...prev, file[i]]);
    }
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Product Image</DialogTitle>
      <Tabs
        value={uploadType}
        onChange={(event: React.SyntheticEvent, newValue: string) =>
          setUploadType(newValue)
        }
        centered
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab label="single" value="single" />
        <Tab label="multiple" value="multiple" />
      </Tabs>
      <DialogContent>
        {uploadType == "single" ? (
          <Box sx={{ my: 2 }}>
            <TextInput
              label="Title"
              value={data.title}
              required
              onChange={(e) =>
                setData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <ImageView src={file ? file : data?.image} />
          </Box>
        ) : (
          <Box sx={{ my: 2 }}>
            {bulkFile &&
              bulkFile.map((file, index) => {
                return <ImageView src={file} key={index} />;
              })}
          </Box>
        )}
        <FileUploader
          multiple={uploadType == "multiple" ? true : false}
          handleChange={(file) => {
            uploadType == "multiple" ? handleMultiple(file) : setFile(file);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexFlow: "row-reverse",
          }}
        >
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={onUpload}
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : undefined
            }
          >
            Save
          </Button>
          <Button color="secondary" variant="outlined" onClick={close}>
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
