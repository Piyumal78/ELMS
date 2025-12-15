import { Wrench, Beaker, Laptop as NotebookText, ShieldCheck, LayoutDashboard, BarChartBig } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

const features = [
    {
        icon: Wrench,
        title: 'Equipment Tracking & Maintenance',
        description: 'Keep track of all lab equipment, schedule maintenance, and get alerts for calibration.',
        gradient: 'from-cyan-500 to-blue-500'
    },
    {
        icon: Beaker,
        title: 'Sample & Specimen Management',
        description: 'Log and track samples from collection to disposal.',
        gradient: 'from-blue-500 to-indigo-500'
    },
    {
        icon: NotebookText,
        title: 'Experiment Logging & Documentation',
        description: 'Digitize lab notebooks and document results in real-time.',
        gradient: 'from-indigo-500 to-purple-500'
    },
    {
        icon: ShieldCheck,
        title: 'Safety Compliance & Protocols',
        description: 'Manage SDS, training records, and incident reports centrally.',
        gradient: 'from-purple-500 to-pink-500'
    },
    {
        icon: LayoutDashboard,
        title: 'Real-Time Lab Status Monitoring',
        description: 'View equipment status and team availability at a glance.',
        gradient: 'from-pink-500 to-rose-500'
    },
    {
        icon: BarChartBig,
        title: 'Data Analytics for Lab Performance',
        description: 'Visualize key lab metrics and generate insightful reports.',
        gradient: 'from-orange-500 to-amber-500'
    }
];

export default function FeaturesCard() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
                <AnimatedCard key={index} feature={feature} delay={index * 150} />
            ))}
        </div>
    );
}

function AnimatedCard({ feature, delay }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const Icon = feature.icon;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.2 }
        );

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`group relative bg-slate-900 border border-slate-800 rounded-2xl p-8 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                <Icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
            <p className="text-slate-400">{feature.description}</p>
        </div>
    );
}
