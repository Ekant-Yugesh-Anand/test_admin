export function emptyText(label: string): string {
  return `${label} is not allowed to be empty`;
}

export function minText(label: string): string {
  return `${label} must be at least 2 characters`;
}

export function getStrOrderStatus(status: string) {
  const value: Record<string | number, string> = {
    0: "New",
    1: "Accepted",
    2: "In Process",
    3: "In Process",
    4: "Out For Delivery",
    5: "Delivered",
    6: "Return from farmer",
    7: "Cancel from farmer",
    8: "Return in process",
    9: "Cancel from retailer",
    10: "Cancel from manager/agent",
    11: "Cancel return",
    12: "Return in process",
    13: "Cancel return",
    14: "Return in process",
    15: "Cancel return",
    16: "Return in process",
    17: "Returned",
    18: "Refunded",
    "11,13,15": "Cancel return",
    "2,3": "In Process",
    "9,10": "Rejected",
    "7,9,10": "Cancelled"
  };
  // const key = status instanceof Array ? status.join(",") : status;
  return value[status];
}
