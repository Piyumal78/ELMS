const StudentDetails = () => {
        const labdetails = [
            {
                "labName": "Physics Lab",
                "date": "2024-06-15",
                "time": "10:00 AM - 12:00 PM",
                "status": "Booked"
            },
            {
                "labName": "Chemistry Lab",
                "date": "2024-06-16",
                "time": "2:00 PM - 4:00 PM",
                "status": "Completed"
            },
            {
                "labName": "Biology Lab",
                "date": "2024-06-17",
                "time": "9:00 AM - 11:00 AM",
                "status": "Cancelled"
            },
            {
                "labName": "Computer Science Lab",
                "date": "2024-06-18",
                "time": "1:00 PM - 3:00 PM",
                "status": "Booked"
            },
            {
                "labName": "Electronics Lab",
                "date": "2024-06-19",
                "time": "11:00 AM - 1:00 PM",
                "status": "Completed"
            },
            {
                "labName": "Mechanical Lab",
                "date": "2024-06-20",
                "time": "3:00 PM - 5:00 PM",
                "status": "Cancelled"
            }
        ]; 
    return (
        <div>
           <div className="flex flex-col">
            <span className="text-4xl">Welcome Back, Lahiru Sanjana! 👋</span>
            <span className="text-sm">Here's what's happening with your labs this semester</span>
           </div>
           <div className="grid grid-cols-2 flex justify-between  ">
            {labdetails.map((lab, index) => (
                <div key={index} className="bg-white shadow-md rounded-lg p-4 m-4 ">
                    <h2 className="text-xl font-bold mb-2">{lab.labName}</h2>
                    <p className="text-gray-600">Date: {lab.date}</p>   
                    <p className="text-gray-600">Time: {lab.time}</p>
                    <p className={`mt-2 font-semibold ${lab.status === 'Booked' ? 'text-blue-600' : lab.status === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>
                        Status: {lab.status}
                    </p>
                </div>
            ))}
           </div>
        </div>
    )
}
export default StudentDetails;