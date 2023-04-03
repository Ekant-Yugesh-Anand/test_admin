import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";

import { useSnackbar } from "notistack";
import { TextInput } from "../../../form";
import { languageSchema } from "./schemas";
import { shopLanguages } from "../../../../http";

export default function LanguageFormDialog(props: {
  open: boolean;
  close: () => void;
  unit: { [key: string]: any } | null;
  reload: () => void;
  variant: "edit" | "save";
}) {
  const [loading, setLoading] = useState(false);

  const { open, close, unit, reload, variant } = props;
  const { enqueueSnackbar } = useSnackbar();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        language: unit?.language || "",
        lang_code: unit?.lang_code || "",
        language_native: unit?.language_native || "",
      },
      validationSchema: languageSchema,
      enableReinitialize: true,
      async onSubmit(values) {
        setLoading(true);
        if (variant === "edit" && unit) {
          try {
            const res = await shopLanguages("put", {
              params: unit.language_id,
              data: JSON.stringify(values),
            });
            if (res?.status === 200) {
              close();
              reload();
              setTimeout(() => {
                enqueueSnackbar("Language Updated  successfully!👍😊", {
                  variant: "success",
                });
              }, 200);
            }
          } catch (error) {
            console.log(error);
            enqueueSnackbar("Language Update Failed!😢", {
              variant: "error",
            });
          }
        } else {
          try {
            const res = await shopLanguages("post", {
              data: JSON.stringify(values),
            });
            if (res?.status === 200) {
              close();
              reload();
              setTimeout(() => {
                enqueueSnackbar("Language Saved  successfully!👍😊", {
                  variant: "success",
                });
              }, 200);
            }
          } catch (error) {
            console.log(error);
            enqueueSnackbar("Language Save Failed!😢", {
              variant: "error",
            });
          }
        }
        setLoading(false);
      },
    });

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Language {variant === "edit" ? "Edit" : "Add"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Language"
            name="language"
            value={values.language}
            onChange={handleChange}
            error={errors.language && touched.language ? true : false}
            helperText={touched.language ? (errors.language as string) : ""}
            onBlur={handleBlur}
          />
          <TextInput
            label="Language Native"
            name="language_native"
            value={values.language_native}
            onChange={handleChange}
            error={
              errors.language_native && touched.language_native ? true : false
            }
            helperText={
              touched.language_native ? (errors.language_native as string) : ""
            }
            onBlur={handleBlur}
          />
          <TextInput
            label="Language code"
            name="lang_code"
            value={values.lang_code}
            onChange={handleChange}
            error={errors.lang_code && touched.lang_code ? true : false}
            helperText={touched.lang_code ? (errors.lang_code as string) : ""}
            onBlur={handleBlur}
          />
          <Divider sx={{ my: 1 }} />
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
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress color="inherit" size={18} />
                ) : undefined
              }
            >
              <span className="first-letter:uppercase">
                {variant === "edit" ? "update" : variant}
              </span>
            </Button>
            <Button color="secondary" variant="outlined" onClick={close}>
              Close
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
