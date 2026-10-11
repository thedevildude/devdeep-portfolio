import type { ComponentProps } from "react";

const Container = ({ className = "", ...props }: ComponentProps<"div">) => (
  <div className={`mx-auto w-full max-w-5xl px-6 ${className}`} {...props} />
);

export default Container;
