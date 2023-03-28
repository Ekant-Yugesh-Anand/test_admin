import React from "react";
import { styled } from "@mui/material/styles";
import {
  Pagination,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  InputBase,
  Typography,
  Alert,
} from "@mui/material";
import { Box } from "@mui/system";

import Snackbar from "@mui/material/Snackbar";
import { NumericFormat } from "react-number-format";

const Option = styled(MenuItem)({
  fontSize: "small",
});

const GotoContainer = styled("div")`
  input {
    width: 100%;
    min-width: 0;
    padding: 4.8px 11px;
    color: #666;
    font-size: 13px;
    line-height: 1.5715;
    background-color: #fff;
    background-image: none;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    width: 25px;
    margin: 0 8px;
  }
`;

function TablePagination(props: {
  count?: number;
  sizeArray?: number[];
  pageSize?: string;
  onPageSizeSelect?: (value: string) => void;
  page: number;
  onChangePage?: (page: number) => void;
  totalItems?: number;
  hiddenSize?: boolean;
}) {
  const {
    pageSize,
    onPageSizeSelect,
    page,
    onChangePage,
    sizeArray,
    totalItems,
    count,
    hiddenSize,
  } = props;

  const [goto, setGoto] = React.useState<number | undefined>();
  const [snack, setSnack] = React.useState({
    message: "",
    open: false,
  });

  const onChangePageSize = (event: SelectChangeEvent) => {
    const value = event.target.value;
    if (onPageSizeSelect !== undefined) onPageSizeSelect(value);
    if (value) onChangePage && onChangePage(0);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (goto) {
      if (goto > (count as number)) {
        setSnack({ message: `page number is not bigger ${count}`, open: true });
      } else if (goto <= 0) {
        setSnack({
          message: `page number is not smaller 1`,
          open: true,
        });
      } else {
        onChangePage && onChangePage(Number(goto) - 1);
      }
    }
  };

  const sizeArrayValue = React.useMemo(() => {
    if (sizeArray) return sizeArray;
    return [10, 20, 30, 50, 100];
  }, [sizeArray]);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    onChangePage && onChangePage(value - 1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "end",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Typography fontSize="small">Total {totalItems || 0} items</Typography>
      <Pagination
        count={count}
        variant="outlined"
        shape="rounded"
        color="secondary"
        page={page + 1}
        onChange={handleChangePage}
      />
      {!hiddenSize && (
        <>
          <Select
            color="secondary"
            sx={{
              fontSize: "small",
              ".MuiSelect-select": {
                p: 0.8,
              },
            }}
            value={pageSize || sizeArrayValue[0].toString()}
            onChange={onChangePageSize}
          >
            {sizeArrayValue.map((item, index) => (
              <Option value={item.toString()} key={index}>
                show {item} entries
              </Option>
            ))}
          </Select>
          <form onSubmit={onSubmit}>
            <GotoContainer
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <InputLabel htmlFor="goto" sx={{ fontSize: "small" }}>
                Go to
              </InputLabel>
              <NumericFormat
                value={goto}
                placeholder="page"
                onValueChange={(values) => setGoto(values.floatValue)}
                name="goto"
                type="text"
                id="goto"
                decimalScale={0}
                customInput={InputBase}
              />
            </GotoContainer>
          </form>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={snack.open}
            onClose={() => setSnack({ message: "", open: false })}
          >
            <Alert severity="error" sx={{ width: "100%" }}>
              {snack.message}
            </Alert>
          </Snackbar>
        </>
      )}
    </Box>
  );
}

export default React.memo(TablePagination);
