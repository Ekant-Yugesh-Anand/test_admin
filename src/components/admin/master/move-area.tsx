import React from "react";

export default function MoveArea() {
  const [left, setLeft] = React.useState<Array<Record<string, any>>>([]);
  const [right, setRight] = React.useState<Array<Record<string, any>>>([]);
  const [leftSelectValue, setLeftSelectValue] = React.useState<string[]>([]);
  const [rightSelectValue, setRightSelectValue] = React.useState<string[]>([]);

  const handleLeftRight = (variant: "left" | "right") => () => {
    const leftNewValue: Record<string, any>[] = [];
    const rightNewValue: Record<string, any>[] = [];
    if (variant === "left") {
      for (const value of left) {
        const x = leftSelectValue.find((a) => parseInt(a) === value.area_id)
          ? false
          : true;
        if (x) {
          leftNewValue.push(value);
        } else {
          if (!right.find((a) => a.area_id === value.area_id))
            rightNewValue.push(value);
        }
      }

      setLeft(leftNewValue);
      setRight((prev) => [...rightNewValue, ...prev]);
    } else if (variant === "right") {
      for (const value of right) {
        const x = rightSelectValue.find((a) => parseInt(a) === value.area_id)
          ? false
          : true;
        if (x) {
          rightNewValue.push(value);
        } else {
          if (!left.find((a) => a.area_id === value.area_id))
            leftNewValue.push(value);
        }
      }

      setRight(rightNewValue);
      setLeft((prev) => [...leftNewValue, ...prev]);
    }
  };

  return <div>MoveArea</div>;
}
