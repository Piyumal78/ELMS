import { CircuitBoard } from 'lucide-react';
const SignUpDetails = () => {
    const activeData = [
        {number: '500+', label: 'Institutions'},
        {number: '10K+', label: 'Active Users'},
        {number: '1M+', label: 'Experiments Managed'},
        {number: '99.9%', label: 'Uptime Guarantee'}
    ]
    return (
        <div className='flex flex-col justify-center  bg-sky-900 border-2 border-white w-2/5 py-7 px-16 rounded-l-2xl gap-6 h-156 overflow-hidden'>
            <div className="flex p-2 px-8 gap-3 items-center">
                <CircuitBoard size={52} className="text-white bg-gradient-to-r from-teal-400 to-blue-500 rounded-sm p-1" />
                <div>
                    <span className="text-white text-3xl font-bold flex items-center">
                        ELMS
                    </span>
                    <span className=''>Electronic Lab Management</span>
                </div>
            </div>
            <div className=''>
                <span className='text-3xl text-white font-bold flex justify-center '>Digital Intelligence for Smart Laboratories</span> <br />
                <span className='text-base text-black py-8'>
                    Streamline your lab operations with our <br /> comprehensive management system designed for <br /> modern academic institutions.
                </span>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6'>
                 {activeData.map((data, index) => (
                    <div key={index} className="p-4 flex flex-col items-center justify-center bg-slate-900 rounded-lg shadow-md w-52 h-32">
                        <span className="text-3xl text-white font-bold">{data.number}</span>
                        <span className="text-base text-white">{data.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default SignUpDetails;