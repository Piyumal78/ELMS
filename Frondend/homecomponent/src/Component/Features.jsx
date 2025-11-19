import FeaturesCard from './FeatureCard';

export default function Features() {
  return (
    <section className="py-12 px-4 bg-slate-950 rounded-2xl">
      <div className="flex flex-col justify-center items-center mb-10 gap-2">
        <span className="text-6xl font-bold text-white">A Feature Set for the Modern Lab</span>
        <span className="text-xl text-center text-gray-400">
          LabFlow provides a comprehensive suite of tools to streamline every aspect of your laboratory's
        </span>
        <span className="text-xl text-center text-gray-400">
          operations, from logistics to discovery.
        </span>
      </div>
      <FeaturesCard />
    </section>
  );
}
