import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircuitBoard, Bell, Menu, X, LogOut, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../lib/redux/store";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/signin');
    };

    const getInitials = (username) => {
        if (!username) return "U";
        const parts = username.split('/');
        return parts[parts.length - 1]?.substring(0, 2).toUpperCase() || "U";
    };

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
                <div className="hidden md:flex items-center gap-4 text-white">
                    <Link to="/notification">
                        <Bell className="hover:text-teal-300 cursor-pointer" />
                    </Link>
                    <div className="relative">
                        <button 
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center gap-2 hover:bg-slate-700 px-3 py-2 rounded-lg transition"
                        >
                            <div className="rounded-full bg-blue-600 h-8 w-8 flex items-center justify-center">
                                <span className="text-sm font-bold text-white">
                                    {getInitials(user?.username)}
                                </span>
                            </div>
                            <span className="text-sm font-medium">{user?.username || "User"}</span>
                        </button>
                        {userMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                <div className="px-4 py-2 border-b">
                                    <p className="text-sm font-semibold text-gray-800">{user?.username}</p>
                                    <p className="text-xs text-gray-500">{user?.role}</p>
                                </div>
                                <Link 
                                    to="/profile" 
                                    onClick={() => setUserMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <User size={16} />
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
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
                    <div className="border-t border-slate-700 pt-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="rounded-full bg-blue-600 h-8 w-8 flex items-center justify-center">
                                <span className="text-sm font-bold text-white">
                                    {getInitials(user?.username)}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">{user?.username || "User"}</p>
                                <p className="text-xs text-gray-400">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-lg"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
