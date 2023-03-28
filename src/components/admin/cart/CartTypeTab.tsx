import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

function CartTypeTab(props: {
  value: number;
  onChange: (value: number) => void;
}) {
  const { value, onChange } = props;

  const lists = React.useMemo(
    () => [
      {
        label: "Farmer wise",
      },
      {
        label: "Product wise",
      },
    ],
    []
  );

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        zIndex: 125,
        position: "fixed",
        right: 0,
        left: {
          lg: 280,
          sm: 0,
        },
      }}
      boxShadow={1}
    >
      <Tabs
        textColor="secondary"
        indicatorColor="secondary"
        value={value}
        onChange={(event: React.SyntheticEvent, newValue: number) =>
          onChange(newValue)
        }
        centered
      >
        {lists.map((item, index) => (
          <Tab
            key={index}
            label={item.label}
            sx={{ textTransform: "capitalize" }}
          />
        ))}
      </Tabs>
    </Box>
  );
}

export default React.memo(CartTypeTab);
