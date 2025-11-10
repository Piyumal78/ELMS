import { Search, Bell } from "lucide-react";

export default function Navigation() {
    const details = [{
        name: "John Doe",
        role: "Student",
        shortName: "JD",
    }];

    return (
        <div className="flex items-center justify-around w-full px-52 py-2 bg-white border-b gap-96">
            {/* Search Bar */}
            <div className="flex items-center border rounded-md px-3 py-2 w-80 focus-within:ring-2 focus-within:ring-blue-500">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search labs, equipment, courses..."
                    className="ml-2 w-full outline-none"
                />
            </div>

            {/* Notifications and User Info */}
            <div className="flex justify-center items-center gap-6">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />

                <div className="flex gap-4 items-center">
                    {/* Avatar */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-700 to-blue-400 text-xl text-white font-semibold">
                        {details[0].shortName}
                    </div>

                    {/* User Details */}
                    <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{details[0].name}</div>
                        <div className="text-xs text-gray-500">{details[0].role}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
