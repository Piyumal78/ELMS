import * as React from "react";

const buttonVariants = ({
  className = "",
  variant = "default",
  size = "default",
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-gray-400";
  
  const variants = {
    default: "bg-gray-900 text-white hover:bg-gray-800",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-gray-200 bg-white hover:bg-gray-100",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "hover:bg-gray-100",
    link: "text-gray-900 underline-offset-4 hover:underline",
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };
  
  return `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
};

function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}

export { Button, buttonVariants };