import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

function RetailerOrdersTab(props: {
  onSetOrderStatus: (value: string) => void;
  labelStatusList?: Array<{
    id?: string;
    label: string;
    order_status: string;
    child?: Array<{ label: string; order_status: string }>;
  }>;
}) {
  const { onSetOrderStatus, labelStatusList } = props;
  const [value, setValue] = React.useState(
    labelStatusList ? labelStatusList[0].order_status : "21"
  );
  const [anchorEl, setAnchorEl] = React.useState<
    Record<string, null | HTMLElement>
  >({});
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  const lists = React.useMemo(
    () =>
      labelStatusList || [
        {
          label: "All orders",
          order_status: "21",
        },
        {
          label: "new orders",
          order_status: "0",
        },
        {
          label: "accepted orders",
          order_status: "1",
        },
        {
          label: "in transit orders",
          order_status: "2,3",
        },
        {
          label: "out for delivery",
          order_status: "4",
        },
        {
          label: "delivered orders",
          order_status: "5",
        },
        {
          id: "return-order-menu",
          label: "return orders",
          order_status: "6",
          child: [
            {
              label: "new orders",
              order_status: "6",
            },
            {
              label: "accepted orders",
              order_status: "8",
            },
            {
              label: "in process",
              order_status: "12",
            },
            {
              label: "pickup",
              order_status: "14",
            },
            {
              label: "out for pickup",
              order_status: "16",
            },
            {
              label: "returning",
              order_status: "17",
            },
            {
              label: "returned",
              order_status: "18",
            },
            {
              label: "cancel",
              order_status: "11,13,15",
            },
          ],
        },
        {
          label: "cancelled orders",
          order_status: "7,9,10",
        },
      ],
    []
  );

  const handleClickTab = (
    e: React.MouseEvent<HTMLElement>,
    orderStatus: string,
    id?: string
  ) => {
    if (id) {
      setAnchorEl({
        ...anchorEl,
        [id]: e.currentTarget,
      });
    } else {
      onSetOrderStatus(orderStatus);
      setValue(orderStatus);
      setSelectedIndex(-1);
    }
  };

  const handleMenuItemClick = (
    index: number,
    orderStatus: string,
    id?: string
  ) => {
    onSetOrderStatus(orderStatus);
    setSelectedIndex(index);
    if (id) {
      setAnchorEl({
        ...anchorEl,
        [id]: null,
      });
    }
  };

  const handleClose = () => {
    lists.forEach((element) => {
      if (element.id && element.child) {
        setAnchorEl({
          ...anchorEl,
          [element.id]: null,
        });
      }
    });
  };

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
        centered
      >
        {lists.map((item, index) => (
          <Tab
            key={index}
            label={item.label}
            id={item?.id}
            value={item.order_status}
            iconPosition={"end"}
            sx={{ textTransform: "capitalize" }}
            onClick={(e) => handleClickTab(e, item.order_status, item?.id)}
            icon={
              item?.id ? (
                Boolean(anchorEl[item.id]) ? (
                  <MdExpandLess size={20} />
                ) : (
                  <MdExpandMore size={20} />
                )
              ) : undefined
            }
          />
        ))}
      </Tabs>
      {lists.map((item, index) =>
        item.child && item?.id ? (
          <Menu
            key={item.order_status}
            id={item?.id}
            anchorEl={anchorEl[item.id]}
            open={Boolean(anchorEl[item.id])}
            onClose={handleClose}
          >
            {item.child.map((option, index) => (
              <MenuItem
                key={option.order_status}
                selected={index === selectedIndex}
                onClick={() => {
                  setValue(item.order_status);
                  handleMenuItemClick(index, option.order_status, item.id);
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Menu>
        ) : null
      )}
    </Box>
  );
}

export default React.memo(RetailerOrdersTab);
