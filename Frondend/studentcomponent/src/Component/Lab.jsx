import {Button} from "../components/ui/button";
import {Clock3,BookOpen,MapPin} from "lucide-react";
const Lab = () => {
    return (
        <div className="w-11/12 h-2/6 bg-slate-200 flex flex-col items-center justify-between rounded-md mt-10 ml-32 
        border border-gray-300 border-l-4 border-l-blue-700  shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-row items-start justify-between gap-80 mt-6 ml-24">
                <span className="flex py-8 text-3xl">Electronics Lab - Circuit Analysis</span>
                <div className="flex flex-col gap-4">
                    <Button className={"bg-linear-to-r from-blue-700 to-blue-400"}>View Details</Button>
                    <Button className={"bg-slate-500"}>Download Materials</Button>
                </div>
            </div>
            <div className="flex justify-between items-center gap-20 mb-10">
                <div className="flex gap-2">
                    <Clock3 className="text-blue-700" />
                    <span>Friday, 1.00 PM - 4.00 PM</span>
                </div>
                <div className="flex gap-2">
                    <BookOpen className="text-blue-700"/>
                    <span>Prof. John Smith</span>
                </div>
                <div className="flex gap-2">
                    <MapPin className="text-blue-700"/>
                    <span>Building A, Room 101</span>
                </div>
            </div>
        </div>
        
    )
}

export default Lab