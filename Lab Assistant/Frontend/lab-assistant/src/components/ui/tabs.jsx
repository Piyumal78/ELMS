import * as React from "react";

const TabsContext = React.createContext({ value: undefined, onValueChange: () => {} });

function Tabs({ value, onValueChange, children, className = "" }) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function TabsTrigger({ value, children, className = "" }) {
  const ctx = React.useContext(TabsContext);
  const selected = ctx.value === value;
  return (
    <button
      type="button"
      onClick={() => ctx.onValueChange && ctx.onValueChange(value)}
      aria-pressed={selected}
      className={`${className} ${selected ? "bg-[#00C4B4] text-white" : ""}`}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, children, className = "" }) {
  const ctx = React.useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
