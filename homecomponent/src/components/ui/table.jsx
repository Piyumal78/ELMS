import * as React from "react";

function Table({ ...props }) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        className="w-full caption-bottom text-sm"
        {...props}
      />
    </div>
  );
}

function TableHeader({ ...props }) {
  return <thead {...props} />;
}

function TableBody({ ...props }) {
  return <tbody {...props} />;
}

function TableFooter({ ...props }) {
  return <tfoot {...props} />;
}

function TableRow({ ...props }) {
  return (
    <tr
      className="border-b border-gray-200 transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-100"
      {...props}
    />
  );
}

function TableHead({ className, ...props }) {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  );
}

function TableCell({ className, ...props }) {
  return (
    <td
      className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }) {
  return (
    <caption
      className={`mt-4 text-sm text-gray-500 ${className}`}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};