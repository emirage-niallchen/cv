import dynamic from 'next/dynamic';

const LocationMap = dynamic(() => import('@/components/LocationMap'), { ssr: false });

export default function AboutPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">About Me</h1>
      <LocationMap />
    </div>
  );
} 