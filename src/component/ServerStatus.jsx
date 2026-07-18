function ServerStatus() {
  return (
    <div
      className="
      bg-slate-900
      rounded-3xl
      p-8
      border
      border-slate-800
      mt-10
      "
    >
      <h1 className="text-3xl font-bold mb-6">
        Server Status
      </h1>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span>Web Server</span>

          <span className="text-green-400">
            Online
          </span>
        </div>

        <div className="flex justify-between">
          <span>Database</span>

          <span className="text-green-400">
            Online
          </span>
        </div>

        <div className="flex justify-between">
          <span>Mail Server</span>

          <span className="text-yellow-400">
            Maintenance
          </span>
        </div>

        <div className="flex justify-between">
          <span>DNS Server</span>

          <span className="text-red-400">
            Offline
          </span>
        </div>

      </div>
    </div>
  );
}

export default ServerStatus;