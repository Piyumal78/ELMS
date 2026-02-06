import {
    CheckIcon,
    CreditCardIcon,
    InfoIcon,
    MailIcon,
    SearchIcon,
    StarIcon,
} from "lucide-react"

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Button} from "@/components/ui/button"
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
import {LogOut} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../lib/redux/store"


const StudentNavbar = () => {
    const [search, setSearch] = React.useState(""); 
    const filteredLabs = [];
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/signin');
    };

    // User ගේ first letters නගන්න
    const getInitials = (username) => {
        if (!username) return "U";
        const parts = username.split('/');
        return parts[parts.length - 1]?.substring(0, 2).toUpperCase() || "U";
    };
    
    // Role එකෙන් display name එක get කරන්න
    const getRoleDisplay = (role) => {
        if (!role) return "User";
        if (role.includes('STUDENT')) return "Student";
        if (role.includes('LECTURER')) return "Lecturer";
        if (role.includes('STAFF')) return "Staff";
        if (role.includes('ADMIN')) return "Admin";
        if (role.includes('DEMONSTRATOR')) return "Demonstrator";
        return "User";
    };

    return (
        
        <div className="flex justify-center gap-100 w-full max-w-6xl px-200 ">
            {/* <InputGroup className=" h-12">
                <InputGroupInput placeholder="Search labs..." />
                <InputGroupAddon >
                    <SearchIcon />
                </InputGroupAddon>
            </InputGroup> */}
            <div className="flex gap-5  font-medium text-lg mt-2">
                <Link to="/" >
                    Home
                </Link>
                <Link to="/">
                    Dashbord
                </Link>
                <Link to="/student">
                    My Labs
                </Link>
            </div>
            <Button className="flex items-center gap-2 p-3 bg-slate-800 hover:bg-gray-900 border-0 focus:ring-0 h-12">
                <div className="flex flex-row gap-4">
                    <div className="rounded-full bg-blue-600 h-9 w-9 flex items-center justify-center">
                        <span className=" text-center px-2 text-lg font-bold text-white">
                            {getInitials(user?.username)}
                        </span>
                    </div>
                    <div className="flex flex-col items-start w-full text-white">
                        <span className="flex text-lg font-bold">{user?.username || "Student"}</span>
                        <span className="text-xs text-gray-300">{getRoleDisplay(user?.role)}</span>
                    </div>
                    <div>
                        <Select>
                            <SelectTrigger className="w-[40px] border-0 hover:border-0 hover:bg-gray-900 mt-1">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 text-white">
                                <SelectGroup className="p-4">
                                    <SelectItem value="name">{user?.username || "Student"}</SelectItem>
                                    <SelectItem value="email">{user?.email || "student@example.com"}</SelectItem>
                                    <div className="mt-2 border-1 "></div>
                                    <div className=" flex flex-col gap-2 mt-2"> 
                                        <Button className="bg-slate-900 text-white hover:bg-gray-100 hover:text-black">
                                            Profile Settings
                                        </Button>
                                        <Button className="bg-slate-900 text-white hover:bg-gray-100 hover:text-black">
                                            Preferences
                                        </Button>
                                        <Button className="bg-slate-900 text-white hover:bg-gray-100 hover:text-black">
                                            Help & Support
                                        </Button>
                                    </div>
                                    <div className="mt-2 border-1"></div>
                                        <button
                                            className="bg-white text-red-600 hover:bg-gray-100 w-full mt-2 flex items-center justify-center flex-row"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="mr-2 h-4 w-4"/> Logout
                                        </button>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Button>
        </div>
    )
}
export default StudentNavbar;



