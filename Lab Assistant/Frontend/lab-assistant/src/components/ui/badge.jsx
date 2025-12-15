import * as React from "react";

const badgeVariants = ({
  className = "",
  variant = "default",
  ...props
}) => {
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants = {
    default: "border-transparent bg-gray-900 text-white",
    secondary: "border-transparent bg-gray-100 text-gray-900",
    destructive: "border-transparent bg-red-500 text-white",
    outline: "text-gray-900",
  };
  
  return `${baseClasses} ${variants[variant]} ${className}`;
};

function Badge({ className, variant, ...props }) {
  return (
    <div
      className={badgeVariants({ variant, className })}
      {...props}
    />
  );
}

export { Badge, badgeVariants };