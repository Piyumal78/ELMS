import { Button } from "../components/ui/button";
import Features from "./Features";
import { useState } from "react";
const Home = () => {
    const [scrolled, setScrolled] = useState(false);
    return (
        <div className="flex flex-col bg-slate-900 text-white p-8 gap-4">
            <div className="text-8xl font-bold flex flex-col justify-center items-center mt-28">
                <span className="">Streamline Your Lab</span>
                <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">Operations Effortlessly</span>
            </div>
            <div className="flex flex-col text-xl text-center text-gray-700 mb-28">
                <span>Manage experiments, track inventory, collaborate with your team, and analyze results</span>
                <span>all in one powerful platform designed for modern laboratories.</span>
                <Button className="self-center mt-6 bg-gradient-to-r from-teal-400 to-blue-500">
                    Get Started
                </Button>
            </div>
            <div>
                <Features />
            </div>
        </div>
    );
}
export default Home;