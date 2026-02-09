import { motion } from "framer-motion";
import {Activity, CircleCheck , CircleAlert,TrendingUp, icons} from "lucide-react";
import DashboardImage from "@/assets/dashboard.jpeg";

const HomeDashboard = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const labData =[
    { label: 'Active Experiments', value: 24,icons:Activity },
    { label: 'Completed Today', value: 12, icons: CircleCheck },
    { label: 'Pending Reviews', value: 8, icons: CircleAlert },
    { label: 'Completed Reports', value: 87, icons: TrendingUp },
  ]

  return (
    <div className="min-h-screen flex flex-col ">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="text-center flex flex-col justify-center items-center mt-12"
      >
        <motion.span variants={childVariants} className="text-7xl font-bold">
          Intuitive Dashboard Interface
        </motion.span>
        <motion.span variants={childVariants} className="text-xl text-gray-600">
          Get a complete overview of your lab operations at a glance with our modern, user-
        </motion.span>
        <motion.span variants={childVariants} className="text-xl text-gray-600">
          friendly dashboard design.
        </motion.span>
      </motion.div>
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
        >
            {labData.map((data, index) => {
                const IconComponent = data.icons;
                return (
                    <motion.div
                        key={index}
                        variants={childVariants}
                        className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center"
                    >
                        <div className="bg-gradient-to-br from-teal-400 to-blue-500 p-4 rounded-full mb-4 shadow-md">
                            <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-gray-800">{data.value}</span>
                        <span className="text-gray-600 mt-2">{data.label}</span>
                    </motion.div>
                );
            }
            )}
        </motion.div>
        <motion.div 
            variants={childVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}  
        className="mt-12 flex justify-center items-center w-4/5 h-auto mx-36">
                <img src={DashboardImage} alt="Dashboard" className="flex justify-center items-center rounded-lg shadow-lg w-full h-auto object-cover" />
        </motion.div>
    </div>
  );
};

export default HomeDashboard;
