import { CircuitBoard } from "lucide-react";
import {Button} from "../../components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";



export default function Navigation() {
   
    const [click, setClick] = useState(false);
    return (
        <div className="flex bg-slate-900 justify-around items-center w-full px-4 py-2 border-b border-slate-700">
            <div className="flex p-2 px-8 gap-3 items-center">
                <CircuitBoard size={40} className="text-white bg-gradient-to-r from-teal-400 to-blue-500 rounded-sm p-1" />
                <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent text-3xl font-bold flex items-center">
                    ELMS
                </span>
            </div>
            <div className="flex gap-4">
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
            </div>
        </div>
    );
}
