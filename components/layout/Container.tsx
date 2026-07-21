import { type HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "header" | "footer" | "nav";
  size?: "default" | "narrow" | "wide";
};

const sizeStyles = {
  default: "max-w-6xl",
  narrow: "max-w-3xl",
  wide: "max-w-7xl",
};

export function Container({
  as: Component = "div",
  size = "default",
  className = "",
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
