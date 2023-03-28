import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import { FaStore, FaTractor, FaWarehouse } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function UsersDetails(props: {
  values: {
    retailers: number;
    farmers: number;
    warehouse: number;
  };
}) {
  const { values } = props;
  const theme = useTheme();

  const rawData = React.useMemo(() => {
    const total = Object.values(values).reduce(
      (partialSum, a) => partialSum + a,
      0
    );
    const percentage = (value: number) => Math.round((value / total) * 100);

    return {
      retailers: percentage(values.retailers),
      farmers: percentage(values.farmers),
      warehouse: percentage(values.warehouse),
    };
  }, [values]);

  const data = {
    datasets: [
      {
        data: Object.values(rawData),
        backgroundColor: ["#3F51B5", "#e53935", "#FB8C00"],
        borderWidth: 8,
        borderColor: "#FFFFFF",
        hoverBorderColor: "#FFFFFF",
      },
    ],
    labels: ["Farmers", "Warehouse", "Retailers"],
  };

  const options = {
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false,
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
    },
  };

  const devices = [
    {
      title: "Farmers",
      value: rawData.farmers,
      icon: FaTractor,
      color: "#3F51B5",
    },
    {
      title: "Warehouses",
      value: rawData.warehouse,
      icon: FaWarehouse,
      color: "#E53935",
    },
    {
      title: "Retailers",
      value: rawData.retailers,
      icon: FaStore,
      color: "#FB8C00",
    },
  ];

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title="User Details" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: "relative",
          }}
        >
          <Doughnut data={data} options={options} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 2,
          }}
        >
          {devices.map(({ color, icon: Icon, title, value }) => (
            <Box
              key={title}
              sx={{
                p: 1,
                textAlign: "center",
              }}
            >
              <Icon color="action" />
              <Typography color="textPrimary" variant="body1">
                {title}
              </Typography>
              <Typography style={{ color }} variant="h4">
                {value}%
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
