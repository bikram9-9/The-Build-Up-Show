import { getLeads } from "@/lib/actions";
import { PipelineView } from "@/components/pipeline-view";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const leads = await getLeads();

  return (
    <div className="p-6">
      <PipelineView leads={leads} />
    </div>
  );
}
