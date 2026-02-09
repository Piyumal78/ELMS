import { CircuitBoard, LogOut, User, LayoutDashboard } from "lucide-react";
import {Button} from "../../components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../lib/redux/store";



export default function Navigation() {
    const [click, setClick] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, token } = useSelector((state) => state.auth);
    
    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    // Get dashboard route based on user role
    const getDashboardRoute = () => {
        if (!user?.role) return '/';
        if (user.role.includes('STUDENT')) return '/student';
        if (user.role.includes('LECTURER') || user.role.includes('STAFF') || user.role.includes('ADMIN')) {
            return '/dashboard';
        }
        return '/';
    };

    return (
        <div className="flex bg-slate-900 justify-around items-center w-full px-4 py-2 border-b border-slate-700">
            <div className="flex p-2 px-8 gap-3 items-center">
                <CircuitBoard size={40} className="text-white bg-gradient-to-r from-teal-400 to-blue-500 rounded-sm p-1" />
                <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent text-3xl font-bold flex items-center">
                    ELMS
                </span>
            </div>
            <div className="flex gap-4 items-center">
                {user && token ? (
                    // Show when user is logged in
                    <>
                        <div className="flex items-center gap-2 text-white px-3 py-2 bg-slate-800 rounded-md">
                            <User className="w-5 h-5" />
                            <span className="font-medium">{user.username || "User"}</span>
                        </div>
                        <Button 
                            asChild
                            variant="outline" 
                            className="bg-gradient-to-r from-teal-400 to-blue-500 text-white border-0 hover:opacity-90 flex items-center gap-2"
                        >
                            <Link to={getDashboardRoute()}>
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                        </Button>
                        <Button 
                            onClick={handleLogout}
                            variant="outline" 
                            className="bg-red-600 hover:bg-red-700 text-white border-red-600 flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Button>
                    </>
                ) : (
                    // Show when user is not logged in
                    <>
                        <Button asChild variant="outline" className="bg-slate-500 ">
                            <Link to="/signin">
                                Sign in
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="bg-gradient-to-r from-teal-400 to-blue-500">
                            <Link to="/signup"> 
                                Get Start
                            </Link>
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
