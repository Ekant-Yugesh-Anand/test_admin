import React from "react";
import { useSnackbar } from "notistack";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Box, Grid, Button, CircularProgress } from "@mui/material";
import { MainContainer } from "../../../../components/layout";
import { queryToStr } from "../../../../components/admin/utils";
import CommonToolbar from "../../../../components/admin/common-toolbar";
import { retailer, shopAreas, shopRetailerArea } from "../../../../http";
import TextSelectList from "../../../../components/common/text-select-list";
import useStateWithCallback from "../../../../hooks/useStateWithCallback";
import { retailerAreaFields } from "../../../../constants";
import { addSno, removeEsc } from "../../../../components/admin/utils";

export default function RetailerArea() {
  const { retailer_id } = useParams();
  const [left, setLeft] = React.useState<Array<Record<string, any>>>([]);
  const [right, setRight] = React.useState<Array<Record<string, any>>>([]);
  const [leftSelectValue, setLeftSelectValue] = React.useState<string[]>([]);
  const [rightSelectValue, setRightSelectValue] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { data } = useQuery(["retailer-name"], () =>
    retailer("get", { params: retailer_id })
  );
  const retailerName = React.useMemo(() => {
    if (data?.status) return data.data?.retailer_name || "";
    return "";
  }, [data]);
  const { isLoading: leftLoading } = useQuery(
    ["get-all-area-left"],
    () => shopAreas("get"),
    {
      onSuccess(data) {
        if (data?.status === 200) setLeft(data.data || []);
      },
      refetchOnWindowFocus: false,
    }
  );
  const { isLoading: rightLoading } = useQuery(
    ["get-all-retailer-area-right"],
    () =>
      shopRetailerArea("get", {
        postfix: "?" + queryToStr({ retailer_id }),
      }),
    {
      onSuccess(data) {
        if (data?.status === 200) setRight(data.data || []);
      },
      refetchOnWindowFocus: false,
    }
  );

  const handleChangeMultiple =
    (variant: "left" | "right") =>
      (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { options } = event.target;
        const value: string[] = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
          if (options[i].selected) {
            value.push(options[i].value);
          }
        }
        if (variant === "left") setLeftSelectValue(value);
        else if (variant === "right") setRightSelectValue(value);
      };

  const handleLeftRight = (variant: "left" | "right") => () => {
    const leftNewValue: Record<string, any>[] = [];
    const rightNewValue: Record<string, any>[] = [];
    if (variant === "left") {
      for (const value of left) {
        const x = leftSelectValue.find((a) => parseInt(a) === value.area_id)
          ? false
          : true;
        if (x) {
          leftNewValue.push(value);
        } else {
          if (!right.find((a) => a.area_id === value.area_id))
            rightNewValue.push(value);
        }
      }

      setLeft(leftNewValue);
      setRight((prev) => [...rightNewValue, ...prev]);
    } else if (variant === "right") {
      for (const value of right) {
        const x = rightSelectValue.find((a) => parseInt(a) === value.area_id)
          ? false
          : true;
        if (x) {
          rightNewValue.push(value);
        } else {
          if (!left.find((a) => a.area_id === value.area_id))
            leftNewValue.push(value);
        }
      }

      setRight(rightNewValue);
      setLeft((prev) => [...leftNewValue, ...prev]);
    }
  };

  const onCancel = () => navigate(-1);

  const onSave = async () => {
    if (right.length !== 0) {
      setLoading(true);
      try {
        const res = await shopRetailerArea("post", {
          data: JSON.stringify({
            area_id: right.map((value) => value.area_id),
            retailer_id,
          }),
        });
        if (res?.status === 200) {
          enqueueSnackbar("Retailer Area add successfully!", {
            variant: "success",
          });
          navigate(-1);
        }
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Retailer Area add failed!", {
          variant: "error",
        });
      }
      setLoading(false);
    } else {
      enqueueSnackbar("please select retailer areas!", {
        variant: "error",
      });
    }
  };



  const exportHandle = () => {
    try {
      let csvData = right ? right : []

      csvData = addSno(csvData)
      csvData = removeEsc(csvData)
      setCsvData(csvData, () => {
        ref.current.link.click()
      })
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <MainContainer>
      <Container>
        <CommonToolbar
          title={`${retailerName} / Retailer Area`}
          exportProps={{
            ref,
            data: csvData,
            filename: `Retailer-area-csv`,
            onClick: exportHandle,
            headers: retailerAreaFields
          }}
        />
        <Box mt={2}>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12} lg={5}>
              <TextSelectList
                key={1}
                options={left}
                value={leftSelectValue}
                onChange={handleChangeMultiple("left")}
                loading={leftLoading}
                extractObj={{
                  value: "area_id",
                  label: ["pincode  -", "area ,", "state"],
                }}
              />
            </Grid>
            <Grid item xs={12} lg={2}>
              <Grid container direction="column" alignItems="center">
                <Button
                  sx={{ my: 0.5, backgroundColor: "#fff" }}
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onClick={handleLeftRight("left")}
                  disabled={left.length === 0}
                >
                  ≫
                </Button>
                <Button
                  sx={{ my: 0.5, backgroundColor: "#fff" }}
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onClick={handleLeftRight("right")}
                  disabled={right.length === 0}
                >
                  ≪
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={5}>
              <TextSelectList
                key={2}
                options={right}
                value={rightSelectValue}
                onChange={handleChangeMultiple("right")}
                loading={rightLoading}
                extractObj={{
                  value: "area_id",
                  label: ["pincode  -", "area ,", "state"],
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          
          <Button
            color="secondary"
            variant="outlined"
            size="small"
            sx={{ backgroundColor: "#fff" }}
            disabled={loading}
            onClick={onCancel}
          >
            Cancel
          </Button>
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
        </Box>
      </Container>
    </MainContainer>
  );
}
