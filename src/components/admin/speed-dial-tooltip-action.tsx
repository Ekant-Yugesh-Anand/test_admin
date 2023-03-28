import * as React from "react";
import Box from "@mui/material/Box";
// import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";

export default function SpeedDialTooltipAction(props: {
  actions: {
    icon: React.ReactNode;
    name: string;
    onClick: () => void;
  }[];
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { actions } = props;

  return (
    <Box sx={{ height: 0, flexGrow: 1 }}>
      {/* <Backdrop open={open} sx={{ zIndex: 1, color: "#fff" }} /> */}
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: "fixed", bottom: 25, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        FabProps={{
          color: "secondary",
          size: "small",
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            id={action.name}
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipPlacement="left"
            onClick={() => {
              action.onClick();
              handleClose();
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
