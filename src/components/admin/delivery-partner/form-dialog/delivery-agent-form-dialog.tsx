import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Box,
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { PatternFormat } from "react-number-format";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import { TextInput } from "../../../form";
import { shopDeliveryAgent } from "../../../../http";
import { deliveryAgentSchema } from "../schemas";
import { filterPhoneNo } from "../../utils";

export default function deliveryAgentFormDialog(props: {
  open: boolean;
  deliveryAgent: { [key: string]: any } | null;
  variant: "edit" | "save";
  close: () => void;
  reload: () => void;
}) {
  const { open, close, deliveryAgent, reload, variant } = props;
  const { enqueueSnackbar } = useSnackbar();

  const { partner_id } = useParams();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        agent_name: deliveryAgent?.agent_name || "",
        email_id: deliveryAgent?.email_id || "",
        phone_no: filterPhoneNo(deliveryAgent?.phone_no, true),
      },
      validationSchema: deliveryAgentSchema,
      enableReinitialize: true,
      async onSubmit(values) {
        if (variant === "edit" && deliveryAgent) {
          try {
            const res = await shopDeliveryAgent("put", {
              params: deliveryAgent.agent_id,
              data: JSON.stringify({
                ...values,
                partner_id,
                phone_no: filterPhoneNo(values?.phone_no),
              }),
            });
            if (res?.status === 200) {
              close();
              reload();
              setTimeout(() => {
                enqueueSnackbar("Delivery Agent Updated successfully!", {
                  variant: "success",
                });
              }, 2000);
            }
          } catch (error: any) {
            const {
              status,
              data: { message },
            } = error.response;
            if (status === 400) {
              setTimeout(() => {
                enqueueSnackbar(message, { variant: "error" });
              }, 200);
            } else {
              setTimeout(() => {
                enqueueSnackbar("Delivery Agent Update Failed", {
                  variant: "error",
                });
              }, 2000);
            }
          }
        } else {
          try {
            const res = await shopDeliveryAgent("post", {
              data: JSON.stringify({
                ...values,
                partner_id,
                phone_no: filterPhoneNo(values?.phone_no),
              }),
            });
            if (res?.status === 200) {
              close();
              reload();
              setTimeout(() => {
                enqueueSnackbar("Delivery Agent Saved successfully", {
                  variant: "success",
                });
              }, 2000);
            }
          } catch (error: any) {
            const {
              status,
              data: { message },
            } = error.response;
            if (status === 400) {
              setTimeout(() => {
                enqueueSnackbar(message, { variant: "error" });
              }, 2000);
            } else {
              setTimeout(() => {
                enqueueSnackbar("Delivery Agent Save Failed", {
                  variant: "error",
                });
              }, 2000);
            }
          }
        }
      },
    });

  const basicFields = React.useMemo(
    () => [
      {
        type: "text",
        label: "Agent Name",
        name: "agent_name",
        placeholder: "agent name",
      },
      {
        type: "text",
        label: "Email",
        name: "email_id",
        placeholder: "email",
      },
      {
        type: "numeric",
        label: "Phone Number",
        name: "phone_no",
        format: "+91 ##########",
        allowEmptyFormatting: true,
        mask: "_",
      },
    ],
    []
  );

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>
        {variant === "edit" ? "Edit" : "Add"} Delivery Agent
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          {basicFields.map((item, index) => {
            const { type, format, ...others } = item;
            return item.type === "numeric" ? (
              <PatternFormat
                {...others}
                type="tel"
                format={format || ""}
                customInput={TextInput}
                key={index}
                name={item.name}
                value={(values as any)[item.name] || ""}
                onChange={handleChange}
                error={
                  (errors as any)[item.name] && (touched as any)[item.name]
                    ? true
                    : false
                }
                helperText={
                  (touched as any)[item.name] ? (errors as any)[item.name] : ""
                }
                onBlur={handleBlur}
              />
            ) : (
              <TextInput
                key={index}
                {...item}
                name={item.name}
                value={(values as any)[item.name] || ""}
                onChange={handleChange}
                error={
                  (errors as any)[item.name] && (touched as any)[item.name]
                    ? true
                    : false
                }
                helperText={
                  (touched as any)[item.name] ? (errors as any)[item.name] : ""
                }
                onBlur={handleBlur}
              />
            );
          })}
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexFlow: "row-reverse",
            }}
          >
            <Button type="submit" color="secondary" variant="contained">
              <span className="first-letter:uppercase">{variant}</span>
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
