import React from "react";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Auth0Form from "./auth0-form";
import FileUploader from "../../form/inputs/file-uploader";
import ImageView from "../../Image/image-view";
import useBucket from "../../../hooks/useBucket";
import { auth0Users } from "../../../http";

export default function Auth0EditDialog(props: {
  open: boolean;
  onClose: () => void;
  user: Record<string, any>;
  refetch: Function;
}) {
  const { open, onClose, user, refetch } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { S3UpdateImage } = useBucket("user-images");

  const [loading, setLoading] = React.useState(false);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      nickname: user?.nickname || "",
      file: user?.picture || "",
    },
    enableReinitialize: true,
    async onSubmit(values) {
      try {
        setLoading(true);
        const { file, ...others } = values;
        const metadata: any = await S3UpdateImage(user.picture, file);
        if (metadata) {
          // upload data in server
          const res = await auth0Users("patch", {
            params: user.user_id,
            data: JSON.stringify({
              ...others,
              picture: metadata.Location,
            }),
          });
          // uploading finish return true
          if (res?.status === 200) {
            onClose();
            setTimeout(
              () =>
                enqueueSnackbar("Auth0 user update successfully", {
                  variant: "success",
                }),
              200
            );
            refetch();
          }
        }
      } catch (error) {
        enqueueSnackbar("Auth0 user update failed", {
          variant: "error",
        });
      }
      setLoading(false);
    },
  });

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>User Edit</DialogTitle>
      <DialogContent>
        <ImageView
          src={values.file}
          useAvatar
          avatarSx={{
            width: 150,
            height: 150,
            margin: "auto",
          }}
        />
        <form onSubmit={handleSubmit}>
          <Box>
            <Auth0Form
              values={values}
              touched={touched}
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
            <FileUploader
              handleChange={(file) => setFieldValue("file", file)}
            />
          </Box>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              gap: 2,
              flexFlow: "row-reverse",
            }}
          >
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              size="small"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : undefined
              }
            >
              Save
            </Button>
            <Button
              color="secondary"
              variant="outlined"
              onClick={onClose}
              size="small"
            >
              Close
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
