import Navbar from "./Navbar";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { ChevronDown, FileText, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LabDetails = () => {
    const navigate = useNavigate();
    const experimentName = [
        { no: "Experiment 1", title: "Introduction to Microcontrollers", open: "Friday, 19 September 2025, 1:00 PM", due: "Friday, 19 September 2025, 3:50 PM", shortname: "E01", close: "Friday, 19 September 2025, 4:00 PM" },
        { no: "Experiment 2", title: "GPIO Programming", open: "Friday, 26 September 2025, 1:00 PM", due: "Friday, 26 September 2025, 3:50 PM", shortname: "E02", close: "Friday, 26 September 2025, 4:00 PM" },
        { no: "Experiment 3", title: "ADC and DAC Interfacing", open: "Friday, 3 October 2025, 1:00 PM", due: "Friday, 3 October 2025, 3:50 PM", shortname: "E03", close: "Friday, 3 October 2025, 4:00 PM" },
        { no: "Experiment 4", title: "Serial Communication", open: "Friday, 10 October 2025, 1:00 PM", due: "Friday, 10 October 2025, 3:50 PM", shortname: "E04", close: "Friday, 10 October 2025, 4:00 PM" },
        { no: "Experiment 5", title: "PWM Generation", open: "Friday, 17 October 2025, 1:00 PM", due: "Friday, 17 October 2025, 3:50 PM", shortname: "E05", close: "Friday, 17 October 2025, 4:00 PM" },
        { no: "Experiment 6", title: "Interrupt Handling", open: "Friday, 24 October 2025, 1:00 PM", due: "Friday, 24 October 2025, 3:50 PM", shortname: "E06", close: "Friday, 24 October 2025, 4:00 PM" },
        { no: "Experiment 7", title: "Timer and Counter", open: "Friday, 31 October 2025, 1:00 PM", due: "Friday, 31 October 2025, 3:50 PM", shortname: "E07", close: "Friday, 31 October 2025, 4:00 PM" },
        { no: "Experiment 8", title: "I2C Communication", open: "Friday, 7 November 2025, 1:00 PM", due: "Friday, 7 November 2025, 3:50 PM", shortname: "E08", close: "Friday, 7 November 2025, 4:00 PM" },
        { no: "Experiment 9", title: "SPI Communication", open: "Friday, 14 November 2025, 1:00 PM", due: "Friday, 14 November 2025, 3:50 PM", shortname: "E09", close: "Friday, 14 November 2025, 4:00 PM" },
        { no: "Experiment 10", title: "Final Project", open: "Friday, 21 November 2025, 1:00 PM", due: "Friday, 21 November 2025, 3:50 PM", shortname: "E10", close: "Friday, 21 November 2025, 4:00 PM" },
    ];
    return (
        <div className="flex flex-col bg-slate-200 h-full">
            <Navbar />
            <span className="text-4xl font-bold pt-4 pl-20">BECS 31412 - Microcontrollers and Embedded Electronics (23/24)</span>
            <div>
                <div className="bg-white p-8 mx-12 my-8 rounded-xl">
                    <div className="flex flex-col border-2 rounded-xl border-slate-300 bg-white m-8">
                        <div className="flex gap-4 items-center p-6">
                            <ChevronDown />
                            <span className="text-2xl font-semibold">General</span>
                        </div>
                        <div className="flex gap-4 items-center p-4 ">
                            <FileText className="text-slate-800" />
                            <span>Announcement</span>
                        </div>
                    </div>
                    <div>
                        {experimentName.map((experiment, index) => (
                            <div key={index} className="flex justify-between items-center border-2 rounded-xl border-slate-300 bg-white m-8 p-6">
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <div className="w-full flex items-center gap-8">
                                            <AccordionTrigger className="w-10 h-10 flex justify-between items-center rounded-full bg-slate-300 px-2 py-2 ">
                                            </AccordionTrigger>
                                            <span className="text-2xl font-bold">{experiment.no} - {experiment.title}</span>
                                        </div>
                                        <AccordionContent className="mt-4">
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        console.log("Button clicked:", experiment.no);
                                                        navigate("/submission", {
                                                            state: { title: `${experiment.no} - Submission` },
                                                            
                                                        });
                                                    }}
                                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"    
                                                >
                                                    <FileUp />
                                                    <span>{experiment.no}-File Submission</span>
                                                </button>
                                                <div className="mt-2 flex gap-68">
                                                    <span className=""><b>Opened:</b> {experiment.open}</span>
                                                    <span className="="><b>Due:</b> {experiment.due}</span>
                                                </div>
                                                <div className="flex flex-col mt-4 text-sm px-12">
                                                    <span>Please submit your files (MATLAB scripts as .m files and plots as .jpeg  and the .pdf file) as a . <b> zip or .rar file.</b></span>
                                                    <span className="mt-6">And please rename your files as,</span>
                                                    <span className="mx-4 font-bold">Your_student_number_Experiment_number.zip</span>
                                                    <span className="mx-4">Ex: EC_2021_xxx_{experiment.shortname}.zip</span>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                                {/* <div className="flex flex-col">
                                    <span className="text-lg font-semibold">{experiment.no} - {experiment.title}</span>
                                    <div className="flex gap-4 mt-2">
                                        <span className="text-sm text-gray-600">Open: {experiment.open}</span>
                                        <span className="text-sm text-gray-600">Due: {experiment.due}</span>
                                        <span className="text-sm text-gray-600">Close: {experiment.close}</span>
                                    </div>
                                </div>
                                <div>
                                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                                        <FileUp />
                                        <span>Submit {experiment.shortname}</span>
                                    </button>
                                </div> */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LabDetails;