import {
    Home,
    BookOpen,
    Award,
    Calendar,
    FileText,
    MessageSquare,
    Settings,
    HelpCircle,
    ChevronDown,
    Bell,
    Search
} from "lucide-react"

import { Button } from "@/components/ui/button"
import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CircuitBoard, LogOut, User } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../lib/redux/store"

const StudentNavbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/signin');
    };

    // get user initials for avatar (e.g. from registration number or username)
    const getInitials = (username) => {
        if (!username) return "U";
        const parts = username.split('/');
        return parts[parts.length - 1]?.substring(0, 2).toUpperCase() || "U";
    };

    // get display name from role
    const getRoleDisplay = (role) => {
        if (!role) return "User";
        if (role.includes('STUDENT')) return "Student";
        if (role.includes('LECTURER')) return "Lecturer";
        if (role.includes('STAFF')) return "Staff";
        if (role.includes('ADMIN')) return "Admin";
        if (role.includes('DEMONSTRATOR')) return "Demonstrator";
        return "User";
    };

    const navLinks = [
        { to: "/", label: "Home", icon: Home },
        { to: "/student", label: "My Labs", icon: BookOpen },
        { to: "/grades", label: "Grades", icon: Award },
        { to: "/lab-booking", label: "Lab Booking", icon: Calendar },
    ];

    const isActive = (path) => location.pathname === path;

    return (
            <nav className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-2">
                    <div className="flex items-center justify-between gap-16 h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="p-1.5 bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg transition-transform group-hover:scale-110">
                                <CircuitBoard size={28} className="text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent text-2xl font-bold">
                                ELMS
                            </span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const active = isActive(link.to);
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${active
                                            ? "bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-md"
                                            : "text-gray-300 hover:text-white hover:bg-slate-800"
                                            }`}
                                    >
                                        <Icon size={18} />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <Link to="/announcements" className="relative p-2 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                                <Bell size={20} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </Link>

                            {/* User Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-3 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                {getInitials(user?.username)}
                                            </span>
                                        </div>
                                        <div className="hidden lg:flex flex-col items-start">
                                            <span className="text-white font-semibold text-sm">
                                                {user?.username || "Student"}
                                            </span>
                                            <span className="text-gray-400 text-xs">
                                                {getRoleDisplay(user?.role)}
                                            </span>
                                        </div>
                                        <ChevronDown size={20} className="text-gray-400" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56 bg-slate-900 border-slate-800 text-white"
                                >
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {user?.username || "Student"}
                                            </p>
                                            <p className="text-xs leading-none text-gray-400">
                                                {user?.email || "student@example.com"}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-slate-800" />
                                    <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer">
                                        <Link to="/profile" className="flex items-center">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer">
                                        <Link to="/help" className="flex items-center">
                                            <HelpCircle className="mr-2 h-4 w-4" />
                                            <span>Help & Support</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-slate-800" />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </nav>
    )
}
export default StudentNavbar;



