import { useLocation } from "react-router-dom";
import { FileUp } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Navbar from "./Navbar";
import { Button } from "@/components/ui/button";

const LabSubmission = () => {
    const { state } = useLocation();

    console.log("STATE RECEIVED:", state);

    return (
        <div className="bg-slate-200"> 
            <Navbar />
            <div className="flex flex-col px-20 py-8 gap-6">
                <div className="flex justify-between items-center ">
                <div>
                    <FileUp className="text-4xl text-rose-400 mb-4" />
                    <span className="text-3xl font-bold">{state?.title || "NO STATE RECEIVED"}</span>
                </div>
                <div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                </div>
            <div className="bg-white rounded-xl p-6">
                <div className="flex flex-col gap-2 p-8 text-base text-slate-700 bg-slate-200 rounded-2xl">
                    <span><b>Opened:</b> Monday, 8 December 2025, 12:00 AM</span>
                    <span><b>Due:</b> Wednesday, 17 December 2025, 12:00 AM</span>
                    <div className="border-b-2 border-gray-400"></div>
                    <div className="flex gap-32 items-start">
                        <Button>Download</Button>
                        <span className="">8 December 2025, 8:07 AM</span>
                    </div>
                </div>
                <Button className="mt-6 bg-blue-600 text-white px-20 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                    <FileUp />
                    <span>Submit Assignment</span>
                </Button>
                <div>
                    
                </div>
            </div>
            </div>
        </div>
    );
};

export default LabSubmission;
