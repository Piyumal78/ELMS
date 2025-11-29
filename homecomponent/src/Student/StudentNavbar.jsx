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

const StudentNavbar = () => {
    return (
        <div className="flex justify-center gap-140 w-full max-w-6xl px-4">
            <InputGroup className="border-2 border-black hover:border-4 border-gray-700/80 focus-within:border-primary/50 h-12">
                <InputGroupInput placeholder="Search labs..." />
                <InputGroupAddon >
                    <SearchIcon />
                </InputGroupAddon>
            </InputGroup>
            <Button className="flex items-center gap-2 p-3 bg-slate-100 hover:bg-gray-300 border-0 focus:ring-0 h-12">
                <div className="flex flex-row gap-4">
                    <div className="rounded-full bg-blue-600 h-9 w-9 flex items-center justify-center">
                        <span className=" text-center px-2 text-lg font-bold text-white">Ls</span>
                    </div>
                    <div className="flex flex-col items-start w-full text-black">
                        <span className="flex text-lg font-bold">Lahiru Sanjana</span>
                        <span className="text-xs text-gray-500">Student</span>
                    </div>
                    <div>
                        <Select>
                            <SelectTrigger className="w-[40px] border-0 hover:border-0 hover:bg-gray-300 mt-1">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup className="p-4">
                                    <SelectItem value="name">Lahiru Sanjana</SelectItem>
                                    <SelectItem value="email">fernandosanjana440@gmail.com</SelectItem>
                                    <div className="mt-2 border-1"></div>
                                    <SelectItem  value="settings">
                                        <Button className="bg-white text-black hover:bg-gray-100">
                                            Profile Settings
                                        </Button>
                                    </SelectItem>
                                    <SelectItem value="perferences">
                                        <Button className="bg-white text-black hover:bg-gray-100">
                                            Preferences
                                        </Button>
                                    </SelectItem>
                                    <SelectItem value="help">
                                        <Button className="bg-white text-black hover:bg-gray-100">
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



