import React from "react";
import {
  Box,
  CardContent,
  Card,
  Typography,
  alpha,
  Avatar,
} from "@mui/material";

export default function InnerDashboardCards(props: {
  icon: React.ReactNode;
  title: string;
  color: string;
}) {
  const { icon, title, color } = props;
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Avatar
            variant="rounded"
            sx={{
              backgroundColor: alpha(color, 0.2),
              color: color,
              height: 56,
              width: 56,
            }}
          >
            {icon}
          </Avatar>
          <Typography>{title}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
