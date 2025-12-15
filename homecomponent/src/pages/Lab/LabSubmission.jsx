import { useLocation } from "react-router-dom";
import { useState } from "react";
import { FileUp, Upload, X, FileText } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

const LabSubmission = () => {
    const { state } = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles([...files, ...droppedFiles]);
    };

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles([...files, ...selectedFiles]);
    };

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
    };

    console.log("STATE RECEIVED:", state);

    return (
        <div className="bg-slate-200 min-h-screen"> 
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

                {!isSubmitting ? (
                    <Button 
                        onClick={() => setIsSubmitting(true)}
                        className="mt-6 bg-blue-600 text-white px-20 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                    >
                        <FileUp />
                        <span>Submit Assignment</span>
                    </Button>
                ) : (
                    <div className="mt-6 border-2 border-slate-200 rounded-xl p-6 bg-slate-50">
                        <h3 className="text-lg font-semibold mb-4">File Submission</h3>
                        
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors mb-4 ${
                                isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400'
                            }`}
                        >
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-3 bg-slate-100 rounded-full">
                                    <Upload className="text-slate-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-slate-700 font-medium">Drag and drop your files here</p>
                                    <p className="text-slate-500 text-sm">or</p>
                                </div>
                                <label className="cursor-pointer">
                                    <span className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors text-sm font-medium">
                                        Browse Files
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        multiple
                                        onChange={handleFileSelect}
                                    />
                                </label>
                                <p className="text-xs text-slate-400 mt-2">Accepted file types: PDF, DOCX, ZIP (Max 10MB)</p>
                            </div>
                        </div>

                        {files.length > 0 && (
                            <div className="space-y-2 mb-4">
                                <h4 className="text-sm font-medium text-slate-700">Selected Files:</h4>
                                {files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-blue-500" size={20} />
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">{file.name}</p>
                                                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-4 justify-end">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsSubmitting(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => {
                                    alert("Assignment Submitted Successfully!");
                                    setIsSubmitting(false);
                                    setFiles([]);
                                }}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                )}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Submission status</h3>
                    <div className="rounded-md border bg-white overflow-hidden">
                        <Table>
                            <TableBody>
                                <TableRow className="hover:bg-transparent">
                                    <TableCell className="font-semibold border-r bg-slate-50 w-1/3 p-4">Attempt number</TableCell>
                                    <TableCell className="p-4">This is attempt 1 ( 3 attempts allowed ).</TableCell>
                                </TableRow>
                                <TableRow className="hover:bg-transparent border-t">
                                    <TableCell className="font-semibold border-r bg-slate-50 p-4">Submission status</TableCell>
                                    <TableCell className="p-4">No submissions have been made yet</TableCell>
                                </TableRow>
                                <TableRow className="hover:bg-transparent border-t">
                                    <TableCell className="font-semibold border-r bg-slate-50 p-4">Grading status</TableCell>
                                    <TableCell className="p-4">Not graded</TableCell>
                                </TableRow>
                                <TableRow className="hover:bg-transparent border-t">
                                    <TableCell className="font-semibold border-r bg-slate-50 p-4">Time remaining</TableCell>
                                    <TableCell className="p-4">8 days 2 hours remaining</TableCell>
                                </TableRow>
                                <TableRow className="hover:bg-transparent border-t">
                                    <TableCell className="font-semibold border-r bg-slate-50 p-4">Last modified</TableCell>
                                    <TableCell className="p-4">Not submitted yet</TableCell>
                                </TableRow>
                                <TableRow className="hover:bg-transparent border-t">
                                    <TableCell className="font-semibold border-r bg-slate-50 p-4">Submission comments</TableCell>
                                    <TableCell className="p-4">Comment</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default LabSubmission;
