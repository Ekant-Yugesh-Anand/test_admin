import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Box, Button, ListItem, Collapse } from "@mui/material";
import styled from "@emotion/styled";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

const CustomLink = styled(NavLink)`
  width: 100%;
  text-decoration: none;
`;

export default function NavItem(props: {
  icon: React.ReactNode;
  href?: string;
  title: string;
  children?: React.ReactNode;
}) {
  const { href, icon, title, children } = props;
  const ref = useRef<{ [key: string]: any }>({});

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (ref.current.active && children) {
      console.log(ref.current.active);
    }
  }, [ref.current]);

  return (
    <ListItem
      disableGutters
      sx={{
        display: "block",
        mb: 0.5,
        py: 0,
        px: 2,
      }}
    >
      {href ? (
        <CustomLink to={href}>
          {({ isActive }) => {
            ref.current = { active: isActive };
            return (
              <Button
                startIcon={icon}
                disableRipple={false}
                sx={{
                  px: 3,
                  textAlign: "left",
                  textTransform: "none",
                  width: "100%",
                  color: isActive ? "secondary.main" : "neutral.600",

                  "&:hover": {
                    color: "secondary.main",
                    backgroundColor: "#10b98114",
                  },
                }}
              >
                <Box sx={{ flexGrow: 1 }}>{title}</Box>
              </Button>
            );
          }}
        </CustomLink>
      ) : (
        <Button
          onClick={() => {
            if (children) setOpen(!open);
          }}
          startIcon={icon}
          disableRipple={false}
          sx={{
            px: 3,
            textAlign: "left",
            textTransform: "none",
            width: "100%",
            color: "neutral.500",

            "&:hover": {
              color: "secondary.main",
              backgroundColor: "#10b98114",
            },
          }}
        >
          <Box sx={{ flexGrow: 1 }}>{title}</Box>
          {children &&
            (open ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />)}
        </Button>
      )}
      {children && (
        <Collapse in={open} timeout="auto">
          {children}
        </Collapse>
      )}
    </ListItem>
  );
}
