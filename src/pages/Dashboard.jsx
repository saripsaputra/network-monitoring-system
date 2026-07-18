import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import DeviceTable from "../component/DeviceTable";
import Notification from "../component/Notification";
import Sidebar from "../component/Sidebar";
import Navbar from "../component/Navbar";
import Card from "../component/Card";
import Chart from "../component/Chart";
import SummaryCard from "../component/SummaryCard";

function Dashboard({
  currentPage,
  onNavigate,
  onLogout,
}) {
  const [devices, setDevices] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  const [deviceSummary, setDeviceSummary] = useState({
    total: 0,
    online: 0,
    warning: 0,
    offline: 0,
  });

  const [cpu, setCpu] = useState(35);
  const [ram, setRam] = useState(68);
  const [storage, setStorage] = useState(80);

  useEffect(() => {
    const updateDeviceData = () => {
      const savedDevices =
        localStorage.getItem("devices");

      const deviceData = savedDevices
        ? JSON.parse(savedDevices)
        : [];

      setDevices(deviceData);

      const summary = {
        total: deviceData.length,

        online: deviceData.filter(
          (device) => device.status === "Online"
        ).length,

        warning: deviceData.filter(
          (device) => device.status === "Warning"
        ).length,

        offline: deviceData.filter(
          (device) => device.status === "Offline"
        ).length,
      };

      setDeviceSummary(summary);
    };

    updateDeviceData();

    window.addEventListener(
      "devicesUpdated",
      updateDeviceData
    );

    return () => {
      window.removeEventListener(
        "devicesUpdated",
        updateDeviceData
      );
    };
  }, []);

  useEffect(() => {
    const updateActivityLogs = () => {
      const savedLogs =
        localStorage.getItem("activityLogs");

      const logs = savedLogs
        ? JSON.parse(savedLogs)
        : [];

      setActivityLogs(logs);
    };

    updateActivityLogs();

    window.addEventListener(
      "activityLogsUpdated",
      updateActivityLogs
    );

    return () => {
      window.removeEventListener(
        "activityLogsUpdated",
        updateActivityLogs
      );
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(
        Math.floor(Math.random() * 100)
      );

      setRam(
        Math.floor(Math.random() * 100)
      );

      setStorage(
        Math.floor(Math.random() * 100)
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const exportActivityPDF = () => {
    if (activityLogs.length === 0) {
      window.alert(
        "Belum ada Activity Log untuk diexport!"
      );

      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "Network Monitoring Activity Report",
      14,
      20
    );

    doc.setFontSize(10);

    doc.text(
      `Total Activities: ${activityLogs.length}`,
      14,
      28
    );

    doc.text(
      `Generated: ${new Date().toLocaleString(
        "id-ID"
      )}`,
      14,
      34
    );

    autoTable(doc, {
      startY: 42,

      head: [
        [
          "Action",
          "Hostname",
          "IP Address",
          "Status",
          "Description",
          "Time",
        ],
      ],

      body: activityLogs.map(
        (log) => [
          log.action,
          log.hostname,
          log.ip,
          log.status,
          log.description,
          log.time,
        ]
      ),

      styles: {
        fontSize: 8,
      },

      headStyles: {
        fillColor: [
          6,
          182,
          212,
        ],
      },
    });

    doc.save(
      "activity-log-report.pdf"
    );
  };

  const clearActivityLogs = () => {
    if (activityLogs.length === 0) {
      return;
    }

    const confirmClear = window.confirm(
      "Yakin ingin menghapus semua Activity Log?"
    );

    if (!confirmClear) {
      return;
    }

    localStorage.removeItem(
      "activityLogs"
    );

    setActivityLogs([]);

    window.dispatchEvent(
      new Event(
        "activityLogsUpdated"
      )
    );
  };

  const getNetworkHealth = () => {
    if (deviceSummary.offline > 0) {
      return {
        status: "Critical",
        description: `${deviceSummary.offline} device offline`,
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        dot: "bg-red-400",
      };
    }

    if (deviceSummary.warning > 0) {
      return {
        status: "Attention Required",
        description: `${deviceSummary.warning} device warning`,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
        dot: "bg-yellow-400",
      };
    }

    if (deviceSummary.total === 0) {
      return {
        status: "No Devices",
        description: "No devices available",
        color: "text-slate-400",
        bg: "bg-slate-500/10",
        border: "border-slate-500/30",
        dot: "bg-slate-400",
      };
    }

    return {
      status: "Healthy",
      description:
        "All devices are running normally",
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      dot: "bg-green-400",
    };
  };

  const getActivityStyle = (action) => {
    if (action === "Added") {
      return {
        icon: "+",
        color: "text-green-400",
        bg: "bg-green-500/10",
        border: "border-green-500/30",
      };
    }

    if (action === "Updated") {
      return {
        icon: "✎",
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/30",
      };
    }

    if (action === "Deleted") {
      return {
        icon: "×",
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
      };
    }

    return {
      icon: "•",
      color: "text-slate-400",
      bg: "bg-slate-500/10",
      border: "border-slate-500/30",
    };
  };

  const networkHealth =
    getNetworkHealth();

  return (
    <div
      className="
        min-h-screen
        flex
        text-white
        bg-gradient-to-br
        from-slate-950
        via-slate-900
        to-black
        relative
        overflow-hidden
      "
    >
      <div
        className="
          absolute
          top-0
          right-0
          w-96
          h-96
          bg-cyan-500/10
          blur-[150px]
          rounded-full
          pointer-events-none
        "
      />

      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
      />

      <div className="flex-1 min-w-0">
        <Navbar
          currentPage={currentPage}
          onLogout={onLogout}
          onNavigate={onNavigate}
        />

        <div className="p-8">
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-6
            "
          >
            <Card
              title="CPU Usage"
              value={`${cpu}%`}
            />

            <Card
              title="RAM Usage"
              value={`${ram}%`}
            />

            <Card
              title="Storage"
              value={`${storage}%`}
            />
          </div>

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-6
              mt-8
            "
          >
            <SummaryCard
              title="Total Devices"
              value={deviceSummary.total}
              color="text-cyan-400"
            />

            <SummaryCard
              title="Online"
              value={deviceSummary.online}
              color="text-green-400"
            />

            <SummaryCard
              title="Warning"
              value={deviceSummary.warning}
              color="text-yellow-400"
            />

            <SummaryCard
              title="Offline"
              value={deviceSummary.offline}
              color="text-red-400"
            />
          </div>

          <div
            className={`
              mt-8
              p-6
              rounded-3xl
              border
              backdrop-blur-xl
              ${networkHealth.bg}
              ${networkHealth.border}
            `}
          >
            <div
              className="
                flex
                flex-col
                md:flex-row
                md:items-center
                justify-between
                gap-6
              "
            >
              <div>
                <p className="text-slate-400 text-sm">
                  Network Health
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <span
                    className={`
                      w-3
                      h-3
                      rounded-full
                      ${networkHealth.dot}
                    `}
                  />

                  <h2
                    className={`
                      text-2xl
                      font-bold
                      ${networkHealth.color}
                    `}
                  >
                    {networkHealth.status}
                  </h2>
                </div>

                <p className="text-slate-400 mt-2">
                  {networkHealth.description}
                </p>
              </div>

              <div className="md:text-right">
                <p className="text-slate-500 text-sm">
                  Devices Online
                </p>

                <p className="text-3xl font-bold mt-2">
                  {deviceSummary.online}

                  <span className="text-slate-500 text-lg">
                    {" "}
                    / {deviceSummary.total}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div
            className="
              grid
              xl:grid-cols-3
              gap-6
              mt-10
            "
          >
            <div
              className="
                xl:col-span-2
                bg-slate-900/60
                backdrop-blur-xl
                border
                border-slate-800
                rounded-3xl
                p-6
              "
            >
              <h2 className="text-2xl font-bold mb-8">
                Network Traffic
              </h2>

              <Chart />
            </div>

            <div
              className="
                bg-slate-900/60
                backdrop-blur-xl
                border
                border-slate-800
                rounded-3xl
                p-6
              "
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Server Status
                </h2>

                <span className="text-sm text-slate-500">
                  Live
                </span>
              </div>

              <div className="mt-8 space-y-6">
                {devices
                  .slice(0, 4)
                  .map(
                    (
                      device,
                      index
                    ) => (
                      <div
                        key={`${device.hostname}-${device.ip}-${index}`}
                        className="
                          flex
                          justify-between
                          items-center
                          gap-4
                        "
                      >
                        <div>
                          <p className="font-medium">
                            {device.hostname}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            {device.ip}
                          </p>
                        </div>

                        {device.status ===
                          "Online" && (
                          <span className="text-green-400 whitespace-nowrap">
                            ● Online
                          </span>
                        )}

                        {device.status ===
                          "Warning" && (
                          <span className="text-yellow-400 whitespace-nowrap">
                            ● Warning
                          </span>
                        )}

                        {device.status ===
                          "Offline" && (
                          <span className="text-red-400 whitespace-nowrap">
                            ● Offline
                          </span>
                        )}
                      </div>
                    )
                  )}

                {devices.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-slate-500">
                      No devices available.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DeviceTable />

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
            <div
              className="
                flex
                flex-col
                md:flex-row
                md:items-center
                justify-between
                gap-4
                mb-6
              "
            >
              <div>
                <h2 className="text-2xl font-bold">
                  Recent Activity
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  Latest device management activity
                </p>
              </div>

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    bg-slate-800
                    text-cyan-400
                    px-4
                    py-2
                    rounded-xl
                    text-sm
                  "
                >
                  {activityLogs.length} Activities
                </span>

                <button
                  onClick={exportActivityPDF}
                  disabled={
                    activityLogs.length === 0
                  }
                  className="
                    px-4
                    py-2
                    rounded-xl
                    text-sm
                    font-semibold
                    bg-green-500/10
                    text-green-400
                    border
                    border-green-500/30
                    hover:bg-green-500
                    hover:text-white
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    disabled:hover:bg-green-500/10
                    disabled:hover:text-green-400
                    duration-300
                  "
                >
                  Export Activity PDF
                </button>

                <button
                  onClick={clearActivityLogs}
                  disabled={
                    activityLogs.length === 0
                  }
                  className="
                    px-4
                    py-2
                    rounded-xl
                    text-sm
                    font-semibold
                    bg-red-500/10
                    text-red-400
                    border
                    border-red-500/30
                    hover:bg-red-500
                    hover:text-white
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    disabled:hover:bg-red-500/10
                    disabled:hover:text-red-400
                    duration-300
                  "
                >
                  Clear Activity
                </button>
              </div>
            </div>

            {activityLogs.length === 0 ? (
              <div
                className="
                  text-center
                  py-10
                  text-slate-500
                "
              >
                No activity recorded yet.
              </div>
            ) : (
              <div className="space-y-4">
                {activityLogs
                  .slice(0, 5)
                  .map((log) => {
                    const style =
                      getActivityStyle(
                        log.action
                      );

                    return (
                      <div
                        key={log.id}
                        className="
                          flex
                          flex-col
                          md:flex-row
                          md:items-center
                          justify-between
                          gap-4
                          bg-slate-800/40
                          border
                          border-slate-800
                          rounded-2xl
                          p-4
                          hover:bg-slate-800/70
                          duration-300
                        "
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`
                              w-11
                              h-11
                              rounded-xl
                              border
                              flex
                              items-center
                              justify-center
                              text-xl
                              font-bold
                              shrink-0
                              ${style.color}
                              ${style.bg}
                              ${style.border}
                            `}
                          >
                            {style.icon}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold">
                                {log.hostname}
                              </p>

                              <span
                                className={`
                                  text-xs
                                  ${style.color}
                                `}
                              >
                                {log.action}
                              </span>
                            </div>

                            <p className="text-sm text-slate-400 mt-1">
                              {log.description}
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                              IP: {log.ip}
                            </p>
                          </div>
                        </div>

                        <div className="md:text-right">
                          <p className="text-sm text-slate-400">
                            {log.status}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            {log.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          <Notification />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;