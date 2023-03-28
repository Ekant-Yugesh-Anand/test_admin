import { Card, CardContent, Typography, Grid } from "@mui/material";
import usePrintData from "../../../hooks/usePrintData";

export default function OrderDetailCard(props: {
  labels?: Array<{ [key: string]: any }>;
  data?: { [key: string]: any };
  title: string;
}) {
  const { labels, data, title } = props;

  const { printData: obj } = usePrintData({
    labels: labels,
    data: data,
  });

  return (
    <Card elevation={0} sx={{ height: "100%" }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Grid container>
          {obj.map((item, index) => {
            if (item.get("label") === "Weight") {
              return item.get("Cell").props.children > 0 ? (
                <Grid key={index} item xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign={"justify"}
                  >
                    <strong>{item.get("label")}: </strong>
                    {item.get("Cell").props.children < 999 ? (
                      <>{item.get("Cell")}gm</>
                    ) : (
                      <>{item.get("Cell").props.children / 1000}Kg</>
                    )}
                  </Typography>
                </Grid>
              ) : null;
            }

            if (item.get("label") === "Volume") {
              return item.get("Cell").props.children > 0 ? (
                <Grid key={index} item xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign={"justify"}
                  >
                    <strong>{item.get("label")}: </strong>
                    {item.get("Cell")} cm<sup>3</sup>
                  </Typography>
                </Grid>
              ) : null;
            }

            return (
              <Grid key={index} item xs={12}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign={"justify"}
                >
                  <strong>{item.get("label")}: </strong>
                  {item.get("Cell")}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
}
