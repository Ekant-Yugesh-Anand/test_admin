import { Card, CardContent, Grid, Typography, Avatar } from "@mui/material";
import { NumericFormat } from "react-number-format";

export default function DashboardCard(props: {
  header: string;
  title: string | number;
  icon: React.ReactNode;
  color?: string;
}) {
  const { header, title, icon, color } = props;
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              textTransform="capitalize"
              variant="overline"
            >
              {header}
            </Typography>
            <Typography color="textPrimary" variant="h5">
              <NumericFormat
                displayType="text"
                value={title}
                thousandSeparator
              />
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              variant="rounded"
              sx={{
                backgroundColor: color,
                height: 56,
                width: 56,
              }}
            >
              {icon}
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
