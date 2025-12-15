import * as React from 'react';

function DropdownMenu({ children }) {
  return <div className="relative inline-block">{children}</div>;
}

function DropdownMenuTrigger({ asChild, children }) {
  if (asChild) return children;
  return <button>{children}</button>;
}

function DropdownMenuContent({ children, className = '', align = 'start', ...props }) {
  return (
    <div className={`absolute ${align === 'end' ? 'right-0' : 'left-0'} mt-2 bg-white border border-gray-200 rounded-md shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

function DropdownMenuItem({ children, onClick, className = '' }) {
  return (
    <div onClick={onClick} className={`px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer ${className}`}>
      {children}
    </div>
  );
}

function DropdownMenuLabel({ children, className = '' }) {
  return <div className={`px-3 py-2 text-xs text-gray-500 ${className}`}>{children}</div>;
}

function DropdownMenuSeparator() {
  return <div className="h-px bg-gray-100 my-1" />;
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator };
