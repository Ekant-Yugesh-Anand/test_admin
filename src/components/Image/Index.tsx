import React from "react";

export default function Image(props: {
  src?: string;
  alt: string;
  size?: number | string;
  url?: string;
}) {
  return (
    <div
      className="w-16 h-fit"
      style={{
        width: props.size ? props.size : undefined,
      }}
    >
      <img
        className="w-full h-full"
        src={props.url}
        onError={(e) => {
          (e.target as any).src = "/images/default-image.jpg";
        }}
      />
    </div>
  );
}
