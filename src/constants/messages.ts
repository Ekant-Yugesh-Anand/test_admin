import states from "./states.json";

export function emptyText(label: string): string {
  return `${label} is not allowed to be empty`;
}

export function minText(label: string): string {
  return `${label} must be at least 2 characters`;
}

export function getStrOrderStatus(status: string, returnOrderStatus?: string) {
  const value: Record<string | number, string> = {
    0: "New",
    1: "Accepted",
    2: "Waiting for delivery manager",
    3: "In Process",
    4: "Out For Delivery",
    5: "Delivered",
    6: "Resheduled",
    7: "Cancelled from farmer",
    8: "Restore from farmer",
    9: "Cancelled from retailer",
    10: "Cancelled from manager",
    11: "Restored from retailer",
    12: "Restored from manager",
    20: "Payment Failed",
  };
  const returnValue: Record<string | number, string> = {
    1: "Return initiated",
    2: "Return accepted (retailer)",
    3: "Return cancelled from retailer",
    4: "Waiting for delivery manager(return)",
    5: "Return in process",
    6: "Return cancelled from delivery manager",
    7: "Out for Picked up order(return)",
    8: "Return resheduled",
    9: "Return picked up from farmer",
    11: "Returned",
    12: "Refunded",
    13: "Returned restored from retailer",
    14: "returned restored from manager",
  };

  if (returnOrderStatus) {
    if (returnOrderStatus == "null") return value[status];
    else return returnValue[returnOrderStatus];
  }
  // const key = status instanceof Array ? status.join(",") : status;
  return value[status];
}

export function getPos(stateName: string) {
  let pos: string | number = "";
  for (let i in states) {
    states[i].name == stateName;
    pos = states[i].code;
  }
  return pos;
}
