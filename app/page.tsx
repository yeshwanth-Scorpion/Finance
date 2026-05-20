export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Midway Restaurant Dashboard</h1>
        <p className="text-gray-600 mb-8">
          SMS notifications are enabled. You will receive a text message at your registered phone number when new orders come in.
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h2 className="font-semibold text-green-800">Notifications Active</h2>
          <p className="text-green-700 text-sm mt-1">
            New orders will send SMS to: +61457089774
          </p>
        </div>
      </div>
    </main>
  );
}
