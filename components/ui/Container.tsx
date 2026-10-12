import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const Container = ({
  className,
  isHeader,
  ...props
}: ComponentProps<"div"> & { isHeader?: boolean }) => (
  <div
    className={cn(
      "mx-auto w-full max-w-none px-5 sm:px-10 md:px-16 lg:px-32",
      isHeader && "sm:px-8 md:px-10 lg:px-15",
      className,
    )}
    {...props}
  />
);

export default Container;
