import {
  useEffect,
  useState,
} from "react";

import Sidebar from "../component/Sidebar";
import Navbar from "../component/Navbar";
import DeviceTable from "../component/DeviceTable";
import ServerStatus from "../component/ServerStatus";

function Monitoring({
  currentPage,
  onNavigate,
  onLogout,
}) {
  const [devices, setDevices] =
    useState([]);

  const [filter, setFilter] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const [
    selectedDevice,
    setSelectedDevice,
  ] = useState(null);

  const [
    deviceSummary,
    setDeviceSummary,
  ] = useState({
    online: 0,
    warning: 0,
    offline: 0,
  });

  useEffect(() => {
    const updateDeviceData =
      () => {
        const savedDevices =
          localStorage.getItem(
            "devices"
          );

        const deviceData =
          savedDevices
            ? JSON.parse(
                savedDevices
              )
            : [];

        setDevices(
          deviceData
        );

        setDeviceSummary({
          online:
            deviceData.filter(
              (device) =>
                device.status ===
                "Online"
            ).length,

          warning:
            deviceData.filter(
              (device) =>
                device.status ===
                "Warning"
            ).length,

          offline:
            deviceData.filter(
              (device) =>
                device.status ===
                "Offline"
            ).length,
        });
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

  const filteredDevices =
    devices.filter(
      (device) => {
        const matchFilter =
          filter === "All" ||
          device.status ===
            filter;

        const searchValue =
          search
            .toLowerCase()
            .trim();

        const matchSearch =
          device.hostname
            .toLowerCase()
            .includes(
              searchValue
            ) ||
          device.ip
            .toLowerCase()
            .includes(
              searchValue
            );

        return (
          matchFilter &&
          matchSearch
        );
      }
    );

  const clearSearch = () => {
    setSearch("");
  };

  const resetFilters = () => {
    setSearch("");
    setFilter("All");
  };

  const getStatusColor = (
    status
  ) => {
    if (
      status === "Online"
    ) {
      return "text-green-400";
    }

    if (
      status === "Warning"
    ) {
      return "text-yellow-400";
    }

    return "text-red-400";
  };

  const getFilterButton =
    (status) => {
      if (
        filter === status
      ) {
        if (
          status ===
          "Online"
        ) {
          return "bg-green-500 text-white border-green-500";
        }

        if (
          status ===
          "Warning"
        ) {
          return "bg-yellow-500 text-white border-yellow-500";
        }

        if (
          status ===
          "Offline"
        ) {
          return "bg-red-500 text-white border-red-500";
        }

        return "bg-cyan-500 text-white border-cyan-500";
      }

      return "bg-slate-800/60 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white";
    };

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
      "
    >
      <Sidebar
        currentPage={
          currentPage
        }
        onNavigate={
          onNavigate
        }
      />

      <div className="flex-1 min-w-0">
        <Navbar
          currentPage={
            currentPage
          }
          onLogout={
            onLogout
          }
          onNavigate={
            onNavigate
          }
        />

        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Network Monitoring
            </h1>

            <p className="text-slate-400 mt-2">
              Monitor network
              devices and server
              status.
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-1
              xl:grid-cols-3
              gap-6
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
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >
                <div>
                  <h2 className="text-xl font-bold">
                    Network Overview
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Total{" "}
                    {
                      devices.length
                    }{" "}
                    devices monitored
                  </p>
                </div>

                <span
                  className="
                    px-4
                    py-2
                    bg-cyan-500/10
                    text-cyan-400
                    border
                    border-cyan-500/30
                    rounded-xl
                    text-sm
                  "
                >
                  Live
                </span>
              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-3
                  gap-4
                  mt-6
                "
              >
                <div
                  className="
                    bg-slate-800/60
                    border
                    border-slate-700
                    rounded-2xl
                    p-5
                  "
                >
                  <p className="text-slate-400">
                    Online
                  </p>

                  <h3 className="text-3xl font-bold text-green-400 mt-2">
                    {
                      deviceSummary.online
                    }
                  </h3>
                </div>

                <div
                  className="
                    bg-slate-800/60
                    border
                    border-slate-700
                    rounded-2xl
                    p-5
                  "
                >
                  <p className="text-slate-400">
                    Warning
                  </p>

                  <h3 className="text-3xl font-bold text-yellow-400 mt-2">
                    {
                      deviceSummary.warning
                    }
                  </h3>
                </div>

                <div
                  className="
                    bg-slate-800/60
                    border
                    border-slate-700
                    rounded-2xl
                    p-5
                  "
                >
                  <p className="text-slate-400">
                    Offline
                  </p>

                  <h3 className="text-3xl font-bold text-red-400 mt-2">
                    {
                      deviceSummary.offline
                    }
                  </h3>
                </div>
              </div>
            </div>

            <ServerStatus />
          </div>

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
                lg:flex-row
                lg:items-center
                justify-between
                gap-5
                mb-6
              "
            >
              <div>
                <h2 className="text-2xl font-bold">
                  Device Details
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  Search and filter
                  monitored devices.
                </p>
              </div>

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <button
                  onClick={() =>
                    setFilter(
                      "All"
                    )
                  }
                  className={`
                    px-4
                    py-2
                    rounded-xl
                    border
                    text-sm
                    font-semibold
                    duration-300
                    ${getFilterButton(
                      "All"
                    )}
                  `}
                >
                  All{" "}
                  {
                    devices.length
                  }
                </button>

                <button
                  onClick={() =>
                    setFilter(
                      "Online"
                    )
                  }
                  className={`
                    px-4
                    py-2
                    rounded-xl
                    border
                    text-sm
                    font-semibold
                    duration-300
                    ${getFilterButton(
                      "Online"
                    )}
                  `}
                >
                  Online{" "}
                  {
                    deviceSummary.online
                  }
                </button>

                <button
                  onClick={() =>
                    setFilter(
                      "Warning"
                    )
                  }
                  className={`
                    px-4
                    py-2
                    rounded-xl
                    border
                    text-sm
                    font-semibold
                    duration-300
                    ${getFilterButton(
                      "Warning"
                    )}
                  `}
                >
                  Warning{" "}
                  {
                    deviceSummary.warning
                  }
                </button>

                <button
                  onClick={() =>
                    setFilter(
                      "Offline"
                    )
                  }
                  className={`
                    px-4
                    py-2
                    rounded-xl
                    border
                    text-sm
                    font-semibold
                    duration-300
                    ${getFilterButton(
                      "Offline"
                    )}
                  `}
                >
                  Offline{" "}
                  {
                    deviceSummary.offline
                  }
                </button>
              </div>
            </div>

            <div
              className="
                flex
                flex-col
                md:flex-row
                gap-3
                mb-6
              "
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search hostname or IP address..."
                  className="
                    w-full
                    bg-slate-800/60
                    border
                    border-slate-700
                    rounded-xl
                    px-4
                    py-3
                    pr-12
                    text-white
                    placeholder:text-slate-500
                    outline-none
                    focus:border-cyan-500
                    duration-300
                  "
                />

                {search && (
                  <button
                    onClick={
                      clearSearch
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      w-8
                      h-8
                      rounded-lg
                      text-slate-400
                      hover:text-white
                      hover:bg-slate-700
                      duration-300
                    "
                  >
                    ✕
                  </button>
                )}
              </div>

              {search && (
                <button
                  onClick={
                    clearSearch
                  }
                  className="
                    px-5
                    py-3
                    rounded-xl
                    bg-slate-800
                    border
                    border-slate-700
                    text-slate-300
                    hover:bg-slate-700
                    hover:text-white
                    duration-300
                  "
                >
                  Clear Search
                </button>
              )}
            </div>

            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                justify-between
                gap-2
                mb-4
              "
            >
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="text-cyan-400 font-semibold">
                  {
                    filteredDevices.length
                  }
                </span>{" "}
                of{" "}
                <span className="text-white">
                  {
                    devices.length
                  }
                </span>{" "}
                devices
              </p>

              <p className="text-sm text-slate-500">
                Filter:{" "}
                <span className="text-white">
                  {
                    filter
                  }
                </span>

                {search && (
                  <>
                    {" "}
                    | Search:{" "}
                    <span className="text-cyan-400">
                      "{search}"
                    </span>
                  </>
                )}
              </p>
            </div>

            {devices.length ===
            0 ? (
              <div className="text-center py-10">
                <p className="text-slate-500">
                  No devices
                  available.
                </p>
              </div>
            ) : filteredDevices.length ===
              0 ? (
              <div
                className="
                  text-center
                  py-12
                  bg-slate-800/30
                  border
                  border-slate-800
                  rounded-2xl
                "
              >
                <p className="text-slate-300 font-semibold">
                  No devices found.
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Try another
                  hostname, IP
                  address, or status
                  filter.
                </p>

                <button
                  onClick={
                    resetFilters
                  }
                  className="
                    mt-5
                    px-5
                    py-2
                    rounded-xl
                    bg-cyan-500/10
                    text-cyan-400
                    border
                    border-cyan-500/30
                    hover:bg-cyan-500
                    hover:text-white
                    duration-300
                  "
                >
                  Reset Search
                  & Filter
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                      <th className="text-left p-4">
                        Hostname
                      </th>

                      <th className="text-left p-4">
                        IP Address
                      </th>

                      <th className="text-left p-4">
                        Status
                      </th>

                      <th className="text-left p-4">
                        Detail
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredDevices.map(
                      (
                        device,
                        index
                      ) => (
                        <tr
                          key={`${device.hostname}-${device.ip}-${index}`}
                          className="
                            border-b
                            border-slate-800
                            hover:bg-slate-800/40
                            duration-300
                          "
                        >
                          <td className="p-4 font-medium">
                            {
                              device.hostname
                            }
                          </td>

                          <td className="p-4 text-slate-400">
                            {
                              device.ip
                            }
                          </td>

                          <td className="p-4">
                            <span
                              className={getStatusColor(
                                device.status
                              )}
                            >
                              ●{" "}
                              {
                                device.status
                              }
                            </span>
                          </td>

                          <td className="p-4">
                            <button
                              onClick={() =>
                                setSelectedDevice(
                                  device
                                )
                              }
                              className="
                                px-4
                                py-2
                                rounded-xl
                                bg-cyan-500/10
                                text-cyan-400
                                border
                                border-cyan-500/30
                                hover:bg-cyan-500
                                hover:text-white
                                duration-300
                              "
                            >
                              View Detail
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <DeviceTable />
        </div>
      </div>

      {selectedDevice && (
        <div
          className="
            fixed
            inset-0
            bg-black/70
            backdrop-blur-sm
            flex
            items-center
            justify-center
            z-[100]
            p-4
          "
        >
          <div
            className="
              bg-slate-900
              border
              border-slate-700
              rounded-3xl
              p-8
              w-full
              max-w-lg
              shadow-2xl
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                mb-8
              "
            >
              <div>
                <p className="text-sm text-cyan-400">
                  Device Information
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  {
                    selectedDevice.hostname
                  }
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedDevice(
                    null
                  )
                }
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-slate-800
                  hover:bg-red-500
                  text-slate-400
                  hover:text-white
                  duration-300
                "
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div
                className="
                  bg-slate-800/60
                  border
                  border-slate-700
                  rounded-2xl
                  p-4
                "
              >
                <p className="text-sm text-slate-500">
                  Hostname
                </p>

                <p className="font-semibold mt-1">
                  {
                    selectedDevice.hostname
                  }
                </p>
              </div>

              <div
                className="
                  bg-slate-800/60
                  border
                  border-slate-700
                  rounded-2xl
                  p-4
                "
              >
                <p className="text-sm text-slate-500">
                  IP Address
                </p>

                <p className="font-semibold mt-1">
                  {
                    selectedDevice.ip
                  }
                </p>
              </div>

              <div
                className="
                  bg-slate-800/60
                  border
                  border-slate-700
                  rounded-2xl
                  p-4
                "
              >
                <p className="text-sm text-slate-500">
                  Device Status
                </p>

                <p
                  className={`
                    font-semibold
                    mt-1
                    ${getStatusColor(
                      selectedDevice.status
                    )}
                  `}
                >
                  ●{" "}
                  {
                    selectedDevice.status
                  }
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                setSelectedDevice(
                  null
                )
              }
              className="
                w-full
                mt-8
                bg-cyan-500
                hover:bg-cyan-600
                py-3
                rounded-xl
                font-semibold
                duration-300
              "
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Monitoring;