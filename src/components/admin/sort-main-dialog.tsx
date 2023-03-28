import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Select,
} from "@mui/material";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { AxiosResponse } from "axios";
import { useSnackbar } from "notistack";
import { useQuery } from "@tanstack/react-query";
import useSelectUpDown from "../../hooks/useSelectUpDown";
import { HttpMethod, HttpOption } from "../../http/server-api/server-base";

export default function SortMainDialog(props: {
  id: string;
  title: string;
  extractObj: {
    value: string;
    id: string;
  };
  dataKeyExtract?: string;
  requestFunc: (
    method: HttpMethod,
    options?: HttpOption | undefined
  ) => Promise<AxiosResponse<any, any>> | undefined;
  postfix?: string;
  params?: string;
  open: boolean;
  onClose?: () => void;
  refetch?: () => void;
}) {
  const {
    onClose,
    open,
    title,
    extractObj,
    requestFunc,
    id,
    dataKeyExtract,
    postfix,
    refetch,
    params,
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const ref = React.useRef<HTMLSelectElement>(null);

  const { moveUp, moveDown, getAllOption } = useSelectUpDown(ref);
  const [loading, setLoading] = React.useState(false);

  const { data, isLoading } = useQuery([id], () =>
    requestFunc("get", {
      params,
      postfix,
    })
  );

  const options = React.useMemo(() => {
    try {
      if (data?.status === 200) {
        const x = dataKeyExtract ? data.data[dataKeyExtract] : data.data;
        return x instanceof Array ? x : [];
      }
      return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  }, [data]);

  const onSave = async () => {
    try {
      setLoading(true);
      const res = await requestFunc("post", {
        params: "sort",
        postfix: postfix,
        data: JSON.stringify(getAllOption().map((item) => parseInt(item))),
      });
      if (res?.status === 200) {
        enqueueSnackbar("Data entry sort successfully!", {
          variant: "success",
        });
        refetch && refetch();
        onClose && onClose();
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Data entry sort failed!", {
        variant: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Paper>
          {isLoading ? (
            <Box
              sx={{
                width: "100%",
                height: 250,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress color="secondary" />
            </Box>
          ) : (
            <Select
              inputProps={{
                ref: ref,
                style: {
                  height: "86%",
                },
              }}
              multiple
              native
              fullWidth
              color="secondary"
              id={id}
              sx={{
                width: "100%",
                height: 250,
                "& .MuiInputBase-input:focus": {
                  boxShadow: "none",
                },
              }}
            >
              {options.map((item: Record<string, any>, index: number) => (
                <option key={index} value={item?.[extractObj.id]}>
                  {item?.[extractObj.value]}
                </option>
              ))}
            </Select>
          )}
        </Paper>
        <Box
          sx={{
            mt: 1,
            gap: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            size="medium"
            variant="outlined"
            color="secondary"
            onClick={moveUp}
          >
            <FaArrowUp />
          </Button>
          <Button
            size="medium"
            variant="outlined"
            color="secondary"
            onClick={moveDown}
          >
            <FaArrowDown />
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ mb: 2, mr: 2 }}>
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
            size="small"
            onClick={onSave}
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress color="inherit" size={18} />
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
            disabled={loading}
          >
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
