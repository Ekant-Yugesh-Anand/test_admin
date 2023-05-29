import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

function RetailerOrdersTab(props: {
  onSetOrderStatus: (value: string) => void;
  onSetReturn?: (value: boolean) => void;
  labelStatusList?: Array<{
    id?: string;
    label: string;
    order_status: string;
    child?: Array<{ label: string; order_status: string; return?: boolean }>;
  }>;
}) {
  const { onSetOrderStatus, labelStatusList, onSetReturn } = props;
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
          label: "waiting orders",
          order_status: "2",
        },
        {
          label: "in process orders",
          order_status: "3",
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
          order_status: "22",
          child: [
            {
              label: "new orders",
              order_status: "1",
              return: true,
            },
            {
              label: "accepted orders",
              order_status: "2",
              return: true,
            },
            {
              label: "waiting orders",
              order_status: "4",
              return: true,
            },
            {
              label: " in process orders",
              order_status: "5",
              return: true,
            },

            {
              label: "out for picked up orders",
              order_status: "7",
              return: true,
            },
            {
              label: "resheduled orders",
              order_status: "8",
              return: true,
            },
            {
              label: "picked up form (farmer)",
              order_status: "9",
              return: true,
            },
            {
              label: "returned ",
              order_status: "11",
              return: true,
            },
            {
              label: "cancelled orders",
              order_status: "3,6",
              return: true,
            },
            // {
            //   label: "refunded ",
            //   order_status: "12",
            //   return: true,
            // },
            // {
            //   label: "restored orders",
            //   order_status: "13,14",
            //   return: true,
            // },
          ],
        },
        {
          label: "resheduled orders",
          order_status: "6",
        },
        {
          label: "restored orders",
          order_status: "8,11,12",
        },
        {
          label: "cancelled orders",
          order_status: "7,9,10",
        },
        {
          label: "failed order",
          order_status: "20",
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
      onSetReturn ? onSetReturn(false) : "";
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
        width: "100%",
        
      }}
      boxShadow={1}
    >
      <Box
        sx={{
          width: "80%",
        }}
    
      >
        <Tabs
          textColor="secondary"
          indicatorColor="secondary"
          value={value}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
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
                  key={index}
                  selected={index === selectedIndex}
                  sx={{ textTransform: "capitalize" }}
                  onClick={() => {
                    option.return ? onSetReturn && onSetReturn(true) : "";
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
    </Box>
  );
}

export default React.memo(RetailerOrdersTab);
