import React from "react";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { Box, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import AsyncAutocomplete from "../../../../form/async-autocomplete";
import {
  shopOrders,
  shopReason,
} from "../../../../../http";
import moveOrdersSchemas from "../schemas";
import { TextInput } from "../../../../form";
import dayjs from "dayjs";



export default function ReScheduleOrder(props: {
  onClose: () => void;
  orders: Record<string, any>;
  refetch: Function;
}) {
  const { onClose, orders, refetch } = props;
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      reschedule_reason: "",
      reschedule_other_reason: "",
    },
    validationSchema: moveOrdersSchemas[2],
    async onSubmit(values) {
      const getReschedule = (reason_id: string | number) => {
        let reason = "";
        resheduleReason.map(
          (res: { reason_id: string | number; reason_name: string }) => {
            if (res.reason_id == reason_id) {
              reason = res.reason_name;
            }
          }
        );
        return reason;
      };

      try {
        setLoading(true);
        const res = await shopOrders("post", {
          params: "status",
          data: JSON.stringify({
            ...values,
            order_id: orders.order_id,
            partner_id: orders.partner_id,
            agent_id:orders.agent_id,
            order_status: 3,
            reschedule:"yes",
            reschedule_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            reschedule_reason: getReschedule(values.reschedule_reason),
            user: "admin",
          }),
        });
        if (res?.status === 200) {
          onClose();
          refetch();
          enqueueSnackbar("order moved successfully!", {
            variant: "success",
          });
        }
      } catch (error) {
        console.log(error);
        enqueueSnackbar("order move failed!", {
          variant: "error",
        });
      }
      setLoading(false);
    },
  });

  const { isLoading: resheduleLoading, data: resheduleData } = useQuery(
    ["get-reshedule-reason"],
    () =>
      shopReason("get", {
        params: "reschedule",
      })
  );

  const resheduleReason = React.useMemo(() => {
    if (resheduleData?.status === 200) return resheduleData.data || [];
    return [];
  }, [resheduleData]);

  return (
    <Box mt={2}>
      <Typography my={1} variant={"h6"}>
        Reshedule order
      </Typography>
      <form onSubmit={handleSubmit}>
        <AsyncAutocomplete
          id="reschedule-option"
          sx={{ my: 2 }}
          label="Reschedule Reason"
          options={resheduleReason}
          loading={resheduleLoading}
          value={values.reschedule_reason}
          objFilter={{
            title: "reason_name",
            value: "reason_id",
          }}
          onChangeOption={(value) => setFieldValue("reschedule_reason", value)}
          TextInputProps={{
            error:
              errors["reschedule_reason"] && touched["reschedule_reason"]
                ? true
                : false,
            helperText: touched["reschedule_reason"]
              ? errors["reschedule_reason"]
              : "",
            onBlur: handleBlur,
          }}
        />

        <TextInput
          id="remark"
          name="reschedule_other_reason"
          placeholder="Other Reason"
          multiline={true}
          rows={4}
          value={values.reschedule_other_reason || ""}
          onChange={handleChange}
          error={
            errors.reschedule_other_reason && touched.reschedule_other_reason
              ? true
              : false
          }
          helperText={
            touched.reschedule_other_reason
              ? errors.reschedule_other_reason
              : ""
          }
          onBlur={handleBlur}
        />

        <Box
          sx={{
            display: "flex",
            flexFlow: "row-reverse",
            gap: 2,
            my: 1,
          }}
        >
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            size="small"
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
    </Box>
  );
}
