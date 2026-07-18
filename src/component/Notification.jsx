function Notification() {
  const alerts = [
    {
      device: "Firewall",
      status: "Offline",
    },
    {
      device: "Server-DB",
      status: "Warning",
    },
  ];

  return (
    <div
      className="
      bg-slate-900/60
      backdrop-blur-xl
      border
      border-slate-800
      rounded-3xl
      p-6
      mt-8
    "
    >
      <h2 className="text-2xl font-bold mb-6">
        Notifications
      </h2>

      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="
              flex
              justify-between
              items-center
              bg-slate-800/40
              rounded-2xl
              p-4
            "
          >
            <div>
              <h3 className="font-semibold">
                {alert.device}
              </h3>

              <p className="text-slate-400">
                Device Status Changed
              </p>
            </div>

            {alert.status === "Offline" && (
              <span className="text-red-400 font-bold">
                Offline
              </span>
            )}

            {alert.status === "Warning" && (
              <span className="text-yellow-400 font-bold">
                Warning
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notification;