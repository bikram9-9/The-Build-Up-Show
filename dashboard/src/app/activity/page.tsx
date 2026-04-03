import { getActivityLog } from "@/lib/actions";
import { ActivityFeed } from "@/components/activity-feed";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const activities = await getActivityLog();

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Activity</h1>
        <p className="text-sm text-gray-500">Everything that happened across all leads</p>
      </div>
      <ActivityFeed activities={activities} />
    </div>
  );
}
