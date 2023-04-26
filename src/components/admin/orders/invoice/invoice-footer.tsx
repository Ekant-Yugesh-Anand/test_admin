import { Box, Grid, styled, Typography } from "@mui/material";
import usePrintData from "../../../../hooks/usePrintData";
import { LabelText } from "../orders-dashboard/styled";

const Ul = styled("ul")`
  list-style-type: disc;
  margin-left: 2.5rem;
  @media print {
    font-size: 10px;
  }
`;

const Li = styled("li")`
  font-size: 12px;
  @media print {
    font-size: 8px;
  }
`;

const CustomP = styled(Typography)`
  @media print {
    font-size: 12px;
  }
`;

const disclaimText = [
  "Invoice is raised directly by the seller in favor of Buyer and Digital Saathi has no role in its issuance.",
  "Presence of Digital Saathi logo is for marketing purpose as a facilitator only.",
  "Role and responsibility of Digital Saathi is subject to various conditions and disclaimers provided under Terms of Use of Digital Saathi App.",
];

const label = [
  { title: "Main Order Number", accessor: "main_order_no" },
  { title: "Delivery Charge", accessor: "delivery_charge" },
  { title: "Total Order Amount", accessor: "super_grand_total" },
  { title: "Coupon Applied", accessor: "boucher_amount" },
  {
    title: "Customer to pay",
    accessor: "boucher_amount",
    Cell: (cell: any) => <>{+cell.original.super_grand_total - +cell.value}</>,
  },
];

export default function InvoiceFooter(props: { order: Record<string, any> }) {
  const { order } = props;
  const { printData: obj } = usePrintData({
    labels: label,
    data: order,
  });
  return (
    <Grid container spacing={1} mt={5}>
      <Grid item xs={10}>
        <Typography fontSize="small" variant="subtitle1">
          Disclaimer
        </Typography>
        <Ul>
          {disclaimText.map((s, index) => (
            <Li key={index}>{s}</Li>
          ))}
        </Ul>
      </Grid>
      <Grid item xs={2}>
        <Box textAlign={"right"}>
          <CustomP fontSize="medium" variant="h6" mb={1.5}>
            {order?.retailer_company_name || "  "}
          </CustomP>
          <CustomP fontSize="medium" variant="subtitle2">
            Authorized Signature
          </CustomP>
        </Box>
      </Grid>
      <Grid item xs={10} my={2}>
        <Typography fontSize="small" variant="caption">
          Order Summary
        </Typography>
        <Ul>
          {obj.map((item, index) => {
            if (item.get("Cell")?.props?.children)
              return (
                <Li key={index}>
                  <span>
                    {item.get("title")}: {item.get("Cell")}
                  </span>
                </Li>
              );
          })}
        </Ul>
      </Grid>
    </Grid>
  );
}
