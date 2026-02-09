import { useState } from "react";
import { Link } from "react-router-dom";
import { CircuitBoard, Bell, Menu, X } from "lucide-react";

const Navbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="w-full bg-slate-800 shadow-md">
            <div className="flex justify-between items-center px-6 py-4">
                <div className="flex gap-3 items-center">
                    <CircuitBoard size={40} className="text-white bg-gradient-to-r from-teal-400 to-blue-500 rounded-sm p-1" />
                    <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent text-3xl font-bold">
                        ELMS
                    </span>
                </div>
                <div className="hidden md:flex gap-10 text-white font-bold">
                    <Link to="/student" className="hover:text-teal-300">Home</Link>
                    <Link to="/dashboard" className="hover:text-teal-300">Dashboard</Link>
                    <Link to="/grade" className="hover:text-teal-300">Grade</Link>
                </div>
                <div className="hidden md:flex text-white">
                    <Link to="/notification">
                        <Bell className="hover:text-teal-300" />
                    </Link>
                </div>
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden text-white"
                >
                    {open ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>
            {open && (
                <div className="md:hidden flex flex-col bg-slate-900 text-white px-6 py-4 space-y-4 font-semibold">
                    <Link onClick={() => setOpen(false)} to="/student" className="hover:text-teal-300">
                        Home
                    </Link>
                    <Link onClick={() => setOpen(false)} to="/dashboard" className="hover:text-teal-300">
                        Dashboard
                    </Link>
                    <Link onClick={() => setOpen(false)} to="/grade" className="hover:text-teal-300">
                        Grade
                    </Link>
                    <Link onClick={() => setOpen(false)} to="/notification" className="hover:text-teal-300 flex items-center gap-2">
                        <Bell /> Notifications
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Navbar;
