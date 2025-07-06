import LocationManager from "@/components/admin/location/LocationManager";

export default function LocationPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">位置信息管理</h2>
      <LocationManager />
    </div>
  );
} 