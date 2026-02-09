import React from "react";
import { ClipboardList, Package, Wrench, ShoppingCart, LayoutDashboard } from "lucide-react";

const Sidebar = ({ active, onChangePage }) => {
  const menu = [
    { name: "Dashboard", key: "dashboard", icon: LayoutDashboard },
    { name: "Inventory", key: "inventory", icon: Package },
    { name: "Requests", key: "requests", icon: ClipboardList },
    { name: "Procurement", key: "procurement", icon: ShoppingCart },
    { name: "Maintenance", key: "maintenance", icon: Wrench },
  ];

  return (
    <div className="w-64 bg-white shadow-lg p-4">
      <h2 className="font-bold text-lg mb-6 text-blue-700">Lab Assistant</h2>

      {menu.map((item) => (
        <button
          key={item.key}
          className={`flex items-center gap-3 w-full p-3 rounded-lg mb-2 text-left transition
            ${
              active === item.key
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-100 text-gray-700"
            }
          `}
          onClick={() => onChangePage(item.key)}
        >
          <item.icon size={20} />
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
