import React from "react";
import { User } from "../../App";
import { LogOut } from "../../lib/lucide-react";

interface TopbarProps {
  user: User;
  onLogout: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ user, onLogout }) => {
  return (
    <div className="bg-white shadow flex justify-between items-center px-6 py-4">
      <h2 className="text-xl font-semibold">Lab Assistant Dashboard</h2>

      <div className="flex items-center gap-4">
        <span className="font-medium text-gray-800">{user.name}</span>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
