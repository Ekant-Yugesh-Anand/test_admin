import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { styled, SxProps, Theme } from "@mui/material";
import HighLightText from "../common/high-light-text";

const CustomInput = styled(TextField)(() => ({
  "& .MuiInputBase-input": {
    border: "none",
    "&:focus": {
      boxShadow: "none",
    },
  },
}));

export default function AsyncAutocomplete(props: {
  loading?: boolean;
  options: Array<Record<string, any>>;
  objFilter: {
    title: string;
    value: string;
  };
  label?: string;
  value?: any;
  id: string;
  onChangeOption: (value: any, values?: Record<string, any>) => void;
  TextInputProps?: {
    error?: boolean;
    helperText?: string;
    onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  };
  sx?: SxProps<Theme>;
  multiple?: boolean;
  size?:"small" | "medium"
}) {
  const {
    value: valueOption,
    onChangeOption,
    TextInputProps,
    objFilter,
    options,
    loading,
    label,
    id,
    sx,
    multiple,
    size
  } = props;

  const [value, setValue] = React.useState<Array<{ [key: string]: any }>>([]);
  const [actualValue, setActualValue] = React.useState("");

  const v = React.useMemo(() => {
    if (typeof valueOption === "number") {
      const a = options.filter(
        (values) => values?.[objFilter.value] === valueOption
      )[0];
      if (a) {
        return a;
      }
    } else if (typeof valueOption === "string") {
      const num = parseInt(valueOption);
      if (!isNaN(num)) {
        const a = options.filter(
          (values) => values?.[objFilter.value] === num
        )[0];
        if (a) {
          return a;
        }
      }
    }
    return null;
  }, [valueOption, options]);

  const handleMultipleChange = (n: Array<{ [key: string]: any }>) => {
    let row_id: number[] = [];

    if (n !== null) {
      n.map((value) => {
        row_id.push(value[objFilter.value]);
      });
      setValue(n);
    }
    onChangeOption(row_id.toString());
  };

  if (multiple) {
    React.useEffect(() => {
      if (!actualValue) {
        if (valueOption && options.length > 0) {
          const arr: Array<{ [key: string]: any }> = [];
          let a = valueOption.split(",");
          a.map((b: any) => {
            let temparr = options.filter(
              (values) => values?.[objFilter.value] == b
            );
            temparr && arr.push(...temparr);
          });
          setActualValue(valueOption);
          setValue(arr);
        }
      }
    }, [valueOption, options]);
    return (
      <Autocomplete
        id={id}
        value={value}
        multiple
        onChange={(e, n) => handleMultipleChange(n)}
        getOptionLabel={(option) => option[objFilter.title]}
        options={options}
        loading={loading}
        size="small"
        fullWidth
        sx={sx}
        renderInput={(params) => (
          <CustomInput
            {...params}
            {...TextInputProps}
            color="secondary"
            label={label}
            InputLabelProps={{
              color: "secondary",
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        renderOption={(props, option, { inputValue }) => (
          <li {...props} key={option[objFilter.value]}>
            <HighLightText
              text={option[objFilter.title]}
              highListText={inputValue}
            />
          </li>
        )}
      />
    );
  }

  return (
    <Autocomplete
      id={id}
      value={v}
      onChange={(e, n) => onChangeOption(n !== null ? n[objFilter.value] : "")}
      getOptionLabel={(option) => option[objFilter.title]}
      options={options}
      loading={loading}
      size= {size ? size :"small"}
      fullWidth
      sx={sx}
      renderInput={(params) => (
        <CustomInput
          {...params}
          {...TextInputProps}
          color="secondary"
          label={label}
          InputLabelProps={{
            color: "secondary",
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(props, option, { inputValue }) => (
        <li {...props} key={option[objFilter.value]}>
          <HighLightText
            text={option[objFilter.title]}
            highListText={inputValue}
          />
        </li>
      )}
    />
  );
}
