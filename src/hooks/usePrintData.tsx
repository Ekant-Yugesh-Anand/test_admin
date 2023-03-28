import React from "react";

interface RenderClass {
  get: (value: string) => any;
}

export default function usePrintData(props: {
  labels?: Array<{ [key: string]: any }>;
  data?: { [key: string]: any };
}) {
  const [printData, setPrintData] = React.useState<Array<RenderClass>>([]);

  class Render {
    constructor(object: { [key: string]: any }) {
      Object.keys(object).forEach((key) => {
        (this as any)[key] = object[key];
      });
    }
    get(value: string) {
      const v = (this as any)[value];
      if (typeof v === "undefined" || typeof v === null) {
        return "";
      }
      return v;
    }
  }

  const Cell = (cell: any) => {
    return <>{cell.value}</>;
  };

  const getAccessor = (
    labels: string | Array<string>,
    values: Record<string, any>
  ) => {
    let labelStr = "";
    if (labels instanceof Array) {
      for (const label of labels) {
        const x = label.split(" ");
        if (x.length !== 0) {
          const [f, ...s] = x;
          labelStr += values[f]
            ? ` ${values[f]}${
                s.length !== 0
                  ? s.reduce(
                      (p, c) => (p === "" ? " " : p) + (c === "" ? " " : c)
                    )
                  : ""
              }`
            : "";
        } else {
          labelStr += values[x[0]] ? values[x[0]] : "";
        }
      }
    } else if (typeof labels === "string") {
      return values[labels] ? values[labels] : "";
    }
    return labelStr;
  };

  const instanceCall = () => {
    const valueSet =
      props.labels?.map((item) => {
        let values: Record<string, any> = { ...item, original: props.data };
        if (props.data) {
          values["value"] = getAccessor(item.accessor, props.data);
        }
        values["Cell"] =
          typeof values["Cell"] === "function"
            ? values["Cell"]({ ...values })
            : Cell({ ...values });

        return new Render(values);
      }) || [];
    setPrintData(valueSet);
  };

  React.useEffect(() => {
    if (props.labels) {
      instanceCall();
    }
  }, [props.data]);

  return { printData };
}
