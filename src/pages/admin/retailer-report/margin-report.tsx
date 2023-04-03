import MarginReportTable from "../orders/margin-report-table";
export default function MarginReport() {
  return (
    <MarginReportTable
        orderStatus="5"
        title="Margin Report"
        filename="margin-report"
    />
  );
}
