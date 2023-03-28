import React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import RowSearch from "../../table/row-search";
import { FaFileCsv } from "react-icons/fa";

export default function FarmersListToolbar(props: {
  onClickExport?: () => void;
  onSearch: (value: string) => void;
}) {
  const { onClickExport, onSearch } = props;

  const [searchText, setSearchText] = React.useState("");

  const onReset = () => {
    setSearchText("");
    onSearch("");
  };

  return (
    <Box>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h5">
          Farmers
        </Typography>
        <Box sx={{ m: 1 }}>
          <Button
            color="warning"
            startIcon={<FaFileCsv fontSize="small" />}
            sx={{ mr: 1 }}
            onClick={onClickExport}
          >
            Export
          </Button>
        </Box>
      </Box>
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
                  placeholder="Search"
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
    </Box>
  );
}
