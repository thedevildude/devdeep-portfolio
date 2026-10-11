import type { ComponentProps } from "react";

const Container = ({ className = "", ...props }: ComponentProps<"div">) => (
  <div className={`mx-auto w-full max-w-none px-6 sm:px-10 lg:px-16 ${className}`} {...props} />
);

export default Container;
