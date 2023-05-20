import React from "react";
import {
  Box,
  Select,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import RowSearch from "../table/row-search";

export default function TextSelectList(props: {
  value: Array<string>;
  loading: boolean;
  onChange: Function;
  options: Array<Record<string, any>>;
  extractObj: {
    value: string;
    label: string | Array<string>;
  };
}) {
  const { options, value, onChange, loading, extractObj } = props;
  const [searchText, setSearchText] = React.useState("");

  const [customOption, setCustomOption] = React.useState(options);

  const getLabel = (
    labels: string | Array<string>,
    values: Record<string, any>
  ) => {
    let labelStr = "";
    if (labels instanceof Array) {
      for (const label of labels) {
        const x = label.split(" ");
        if (x.length !== 0) {
          const [f, ...s] = x;
          labelStr += values[f]
            ? ` ${values[f]}${
                s.length !== 0
                  ? s.reduce(
                      (p, c) => (p === "" ? " " : p) + (c === "" ? " " : c)
                    )
                  : ""
              }`
            : "";
        } else {
          labelStr += values[x[0]] ? values[x[0]] : "";
        }
      }
    } else if (typeof labels === "string") {
      return values[labels] ? values[labels] : "";
    }
    return labelStr;
  };

  const onSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { value },
    } = e;
    setCustomOption(
      options.filter((item) => {
        const str = getLabel(extractObj.label, item);
        return typeof str === "string"
          ? str.toLowerCase().includes(value.toLowerCase())
          : false;
      })
    );
    setSearchText(value);
  };

  React.useEffect(() => {
    setCustomOption(
      searchText
        ? options.filter((item) => {
            const str = getLabel(extractObj.label, item);
            return typeof str === "string"
              ? str.toLowerCase().includes(searchText.toLowerCase())
              : false;
          })
        : options
    );
  }, [options]);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <RowSearch
        placeholder={`Record ${options.length}`}
        value={searchText}
        onChange={onSearch}
      />
      <Paper>
        {loading ? (
          <Box
            sx={{
              width: "100%",
              height: 530,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <Select
            multiple
            native
            inputProps={{
              style: {
                height: "90%",
              },
            }}
            value={value}
            onChange={onChange as any}
            fullWidth
            color="secondary"
            sx={{
              width: "100%",
              height: 540,
              "& .MuiInputBase-input:focus": {
                boxShadow: "none",
              },
            }}
          >
            {customOption.map((item: Record<string, any>, index: number) => (
              <option key={index} value={item[extractObj.value]}>
                {getLabel(extractObj.label, item)}
              </option>
            ))}
          </Select>
        )}
      </Paper>
      <Typography>
        Total Record: {options.length} of {customOption.length}
      </Typography>
    </Box>
  );
}
