export default function SettingsPage() {
  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Configure your outreach dashboard</p>
      </div>
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Email</h2>
          <p className="text-xs text-gray-500 mb-4">
            Resend API key and sender address are configured via environment variables.
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600">From Address</label>
              <p className="text-sm text-gray-900 mt-0.5">hello@thebuildupshow.com</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Resend API Key</label>
              <p className="text-sm text-gray-500 mt-0.5">Configured via RESEND_API_KEY env var</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Follow-up Timing</h2>
          <p className="text-xs text-gray-500 mb-4">
            When follow-up emails are automatically sent after the initial email.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Follow-up #1</span>
              <span className="text-sm font-medium text-gray-900">Day 3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Follow-up #2 (final)</span>
              <span className="text-sm font-medium text-gray-900">Day 7</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Supabase</h2>
          <p className="text-xs text-gray-500 mb-4">Database connection configured via environment variables.</p>
          <div>
            <label className="text-xs font-medium text-gray-600">Status</label>
            <p className="text-sm text-green-600 mt-0.5">Connected</p>
          </div>
        </div>
      </div>
    </div>
  );
}
