import React from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import RowSearch from "../table/row-search";
import { FaFileCsv } from "react-icons/fa";
import { Data, Headers } from "react-csv/components/CommonPropTypes";
import { CSVLink } from "react-csv";

export default function CommonToolbar(props: {
  title: string;
  onAddProps?: {
    title: string;
    onClick: () => void;
  };
  onClickSort?: () => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  onClickExport?: () => void;
  exportProps?: {
    title?: string;
    ref?: any;
    headers?: Headers;
    onClick?: () => void;
    data: string | Data | (() => string | Data);
    filename?: string;
  };
  uploadComponent?: React.ReactNode;
  onImport?: () => void;
  titleVariant?: "subtitle" | "h6";
}) {
  const {
    onAddProps,
    onClickSort,
    title,
    onSearch,
    exportProps,
    placeholder,
    titleVariant,
    onImport,
    uploadComponent,
  } = props;

  const [searchText, setSearchText] = React.useState("");

  const onReset = () => {
    setSearchText("");
    onSearch && onSearch("");
  };

  return (
    <>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          m: -0.5,
        }}
      >
        <Typography
          sx={{ m: 1 }}
          variant={
            titleVariant === "subtitle"
              ? "subtitle1"
              : titleVariant === "h6"
                ? "h6"
                : "h5"
          }
        >
          {title}
        </Typography>
        <Box sx={{ m: 1 }}>
          {onImport && (
            <Button
              color="secondary"
              startIcon={<FaFileCsv fontSize="small" />}
              sx={{ mr: 1 }}
              size="small"
              onClick={onImport}
            >
              Import
            </Button>
          )}
          {exportProps && (
            <>
              <CSVLink
                data={exportProps.data}
                headers={exportProps.headers}
                filename={exportProps?.filename}
                target="_blank"
                ref={exportProps.ref}
              />
              <Button
                sx={{ mr: 1 }}
                color="secondary"
                onClick={exportProps?.onClick}
                startIcon={<FaFileCsv fontSize="small" />}
              >
                {exportProps.title ? exportProps.title : "Export"}
              </Button>
            </>
          )}
          {onClickSort && (
            <Button
              sx={{ mr: 1 }}
              color="secondary"
              variant="outlined"
              onClick={onClickSort}
              size="small"
            >
              Sort
            </Button>
          )}
          {onAddProps && (
            <Button
              color="secondary"
              variant="contained"
              onClick={onAddProps.onClick}
              size="small"
            >
              {onAddProps.title}
            </Button>
          )}
        </Box>
      </Box>
      {onSearch && (
        <Box sx={{ mt: 2 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ maxWidth: 250 }}>
                  <RowSearch
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder={placeholder ? placeholder : "Search"}
                  />
                </Box>
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Button
                    color="secondary"
                    variant="contained"
                    size="small"
                    onClick={() => onSearch(searchText)}
                  >
                    Search
                  </Button>
                  <Button
                    sx={{
                      borderColor: "neutral.200",
                      color: "neutral.600",
                      "&:hover": {
                        borderColor: "neutral.300",
                        color: "neutral.800",
                      },
                    }}
                    variant="outlined"
                    size="small"
                    onClick={onReset}
                  >
                    Reset
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  );
}
