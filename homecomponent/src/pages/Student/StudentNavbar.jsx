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
import { Link } from "react-router-dom"

const StudentNavbar = () => {
    const [search, setSearch] = React.useState(""); 
    const filteredLabs = [];

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
                        <span className=" text-center px-2 text-lg font-bold text-white">Ls</span>
                    </div>
                    <div className="flex flex-col items-start w-full text-white">
                        <span className="flex text-lg font-bold">Lahiru Sanjana</span>
                        <span className="text-xs text-gray-300">Student</span>
                    </div>
                    <div>
                        <Select>
                            <SelectTrigger className="w-[40px] border-0 hover:border-0 hover:bg-gray-900 mt-1">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 text-white">
                                <SelectGroup className="p-4">
                                    <SelectItem value="name">Lahiru Sanjana</SelectItem>
                                    <SelectItem value="email">fernandosanjana440@gmail.com</SelectItem>
                                    <div className="mt-2 border-1"></div>
                                    <SelectItem  value="settings">
                                        <Button className="bg-slate-900 text-white hover:bg-gray-100 hover:text-black">
                                            Profile Settings
                                        </Button>
                                    </SelectItem>
                                    <SelectItem value="perferences">
                                        <Button className="bg-slate-900 text-white hover:bg-gray-100 hover:text-black">
                                            Preferences
                                        </Button>
                                    </SelectItem>
                                    <SelectItem value="help">
                                        <Button className="bg-slate-900 text-white hover:bg-gray-100 hover:text-black">
                                            Help & Support
                                        </Button>
                                    </SelectItem>
                                    <div className="mt-2 border-1"></div>
                                    <SelectItem value="logout">
                                        <Button className="bg-white text-red-600 hover:bg-gray-100">
                                            <LogOut className="mr-2 h-4 w-4"/> Sign Out
                                        </Button>
                                    </SelectItem>
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



