import React from "react";
import { NumericFormat } from "react-number-format";
import { Cell } from "react-table";
import { nullFree, round2, totalGst } from "../../../utils";
import { TextCenter } from "../../styles";

export default function NetAmount(props: { cell: Cell }) {
  const {
    cell: {
      row: { original },
    },
  }: Record<string, any> = props;

  const netAmount = React.useMemo(() => {
    const { gst, igstNum } = totalGst(
      nullFree(original?.total_price),
      nullFree(original?.igst)
    );
    return igstNum === 0 ? original?.total_price : gst;
  }, []);
  return (
    <TextCenter>
      <NumericFormat
        value={round2(netAmount)}
        displayType={"text"}
        decimalScale={2}
        thousandSeparator={true}
        prefix={"₹ "}
      />
    </TextCenter>
  );
}
