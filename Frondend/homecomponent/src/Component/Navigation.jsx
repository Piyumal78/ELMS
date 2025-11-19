import { CircuitBoard } from "lucide-react";
import {Button} from "../components/ui/button";
import { useState } from "react";


export default function Navigation() {

    return (
        <div className="flex bg-slate-900 justify-around items-center w-full px-4 py-2 border-b border-slate-700">
            <div className="flex p-2 px-8 gap-3 items-center">
                <CircuitBoard size={40} className="text-white bg-gradient-to-r from-teal-400 to-blue-500 rounded-sm p-1" />
                <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent text-3xl font-bold flex items-center">
                    ELMS
                </span>
            </div>
            <div className="flex gap-4">
                <Button className="bg-slate-500">
                    Sign in
                </Button>
                <Button className="bg-gradient-to-r from-teal-400 to-blue-500">
                    Get Start
                </Button>
            </div>
        </div>
    );
}
