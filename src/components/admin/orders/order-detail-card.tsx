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
    <Card elevation={0} sx={{ height: "100%" }} >
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" className="mb-5">
          {title}
          <hr />
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
                  >  <div className="grid grid-cols-2 ">

                    <Typography fontSize="x-small"><strong>{item.get("label")} </strong></Typography>
                    <Typography fontSize="x-small"> : {item.get("Cell").props.children < 999 ? (
                      <>{item.get("Cell")}gm</>
                    ) : (
                      <>{item.get("Cell").props.children / 1000}Kg</>
                    )}</Typography>
                  </div>
                    
                   
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
                    <div className="grid grid-cols-2 ">
                      <Typography fontSize="x-small">
                        <strong>{item.get("label")} </strong>
                      </Typography>
                      <Typography fontSize="x-small"> : {item.get("Cell")} cm<sup>3</sup>
                      </Typography>
                    </div>
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
                  <div className="grid grid-cols-2 ">
                    <Typography fontSize="x-small">
                      {" "}
                      <strong>{item.get("label")} </strong>
                    </Typography>
                    <Typography fontSize="x-small"> : {item.get("Cell")}</Typography>
                  </div>
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
}
