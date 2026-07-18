import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ToastContainer,
  toast,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function DeviceTable() {
  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  const [devices, setDevices] =
    useState(() => {
      const savedDevices =
        localStorage.getItem(
          "devices"
        );

      return savedDevices
        ? JSON.parse(savedDevices)
        : [
            {
              hostname:
                "Router-Core",
              ip: "192.168.1.1",
              status: "Online",
            },
            {
              hostname:
                "Switch-01",
              ip: "192.168.1.10",
              status: "Online",
            },
            {
              hostname:
                "Server-DB",
              ip: "192.168.1.20",
              status: "Warning",
            },
            {
              hostname:
                "Firewall",
              ip: "192.168.1.254",
              status: "Offline",
            },
          ];
    });

  const [showModal, setShowModal] =
    useState(false);

  const [editModal, setEditModal] =
    useState(false);

  const [editIndex, setEditIndex] =
    useState(null);

  const [hostname, setHostname] =
    useState("");

  const [ip, setIp] =
    useState("");

  const [status, setStatus] =
    useState("Online");

  useEffect(() => {
    localStorage.setItem(
      "devices",
      JSON.stringify(devices)
    );

    window.dispatchEvent(
      new Event(
        "devicesUpdated"
      )
    );
  }, [devices]);

  const addActivityLog = (
    action,
    device,
    description
  ) => {
    const savedLogs =
      localStorage.getItem(
        "activityLogs"
      );

    const oldLogs = savedLogs
      ? JSON.parse(savedLogs)
      : [];

    const newLog = {
      id: Date.now(),
      action,
      hostname:
        device.hostname,
      ip: device.ip,
      status: device.status,
      description,
      time:
        new Date().toLocaleString(
          "id-ID"
        ),
    };

    const updatedLogs = [
      newLog,
      ...oldLogs,
    ].slice(0, 20);

    localStorage.setItem(
      "activityLogs",
      JSON.stringify(
        updatedLogs
      )
    );

    window.dispatchEvent(
      new Event(
        "activityLogsUpdated"
      )
    );
  };

  const filteredDevices =
    devices.filter(
      (device) => {
        const matchSearch =
          device.hostname
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          device.ip.includes(
            search
          );

        const matchFilter =
          filter === "All" ||
          device.status ===
            filter;

        return (
          matchSearch &&
          matchFilter
        );
      }
    );

  const resetForm = () => {
    setHostname("");
    setIp("");
    setStatus("Online");
  };

  const addDevice = () => {
    if (
      !hostname.trim() ||
      !ip.trim()
    ) {
      toast.error(
        "Hostname dan IP Address wajib diisi!"
      );

      return;
    }

    const newDevice = {
      hostname:
        hostname.trim(),
      ip: ip.trim(),
      status,
    };

    setDevices(
      (currentDevices) => [
        ...currentDevices,
        newDevice,
      ]
    );

    addActivityLog(
      "Added",
      newDevice,
      `${newDevice.hostname} berhasil ditambahkan`
    );

    resetForm();
    setShowModal(false);

    toast.success(
      "Device berhasil ditambahkan!"
    );
  };

  const deleteDevice = (
    deviceToDelete
  ) => {
    const confirmDelete =
      window.confirm(
        `Yakin ingin menghapus ${deviceToDelete.hostname}?`
      );

    if (!confirmDelete) {
      return;
    }

    setDevices(
      (currentDevices) =>
        currentDevices.filter(
          (device) =>
            !(
              device.hostname ===
                deviceToDelete.hostname &&
              device.ip ===
                deviceToDelete.ip
            )
        )
    );

    addActivityLog(
      "Deleted",
      deviceToDelete,
      `${deviceToDelete.hostname} berhasil dihapus`
    );

    toast.success(
      "Device berhasil dihapus!"
    );
  };

  const openEdit = (
    device
  ) => {
    const originalIndex =
      devices.findIndex(
        (item) =>
          item.hostname ===
            device.hostname &&
          item.ip === device.ip
      );

    if (
      originalIndex === -1
    ) {
      toast.error(
        "Device tidak ditemukan!"
      );

      return;
    }

    setHostname(
      device.hostname
    );

    setIp(device.ip);

    setStatus(
      device.status
    );

    setEditIndex(
      originalIndex
    );

    setEditModal(true);
  };

  const updateDevice = () => {
    if (
      editIndex === null
    ) {
      return;
    }

    if (
      !hostname.trim() ||
      !ip.trim()
    ) {
      toast.error(
        "Hostname dan IP Address wajib diisi!"
      );

      return;
    }

    const oldDevice =
      devices[editIndex];

    if (!oldDevice) {
      toast.error(
        "Device tidak ditemukan!"
      );

      return;
    }

    const updatedDevice = {
      hostname:
        hostname.trim(),
      ip: ip.trim(),
      status,
    };

    setDevices(
      (currentDevices) =>
        currentDevices.map(
          (
            device,
            index
          ) =>
            index ===
            editIndex
              ? updatedDevice
              : device
        )
    );

    addActivityLog(
      "Updated",
      updatedDevice,
      `${oldDevice.hostname} diupdate menjadi ${updatedDevice.hostname}, status ${updatedDevice.status}`
    );

    resetForm();

    setEditModal(false);
    setEditIndex(null);

    toast.success(
      "Device berhasil diupdate!"
    );
  };

  const closeAddModal =
    () => {
      setShowModal(false);
      resetForm();
    };

  const closeEditModal =
    () => {
      setEditModal(false);
      setEditIndex(null);
      resetForm();
    };

  const exportPDF = () => {
    const doc =
      new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "Network Monitoring Report",
      14,
      20
    );

    autoTable(doc, {
      startY: 30,

      head: [
        [
          "Hostname",
          "IP Address",
          "Status",
        ],
      ],

      body:
        filteredDevices.map(
          (device) => [
            device.hostname,
            device.ip,
            device.status,
          ]
        ),
    });

    doc.save(
      "network-report.pdf"
    );

    toast.success(
      "PDF berhasil diexport!"
    );
  };

  const getStatusClass = (
    deviceStatus
  ) => {
    if (
      deviceStatus ===
      "Online"
    ) {
      return "text-green-400";
    }

    if (
      deviceStatus ===
      "Warning"
    ) {
      return "text-yellow-400";
    }

    return "text-red-400";
  };

  return (
    <>
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
          Network Devices
        </h2>

        <p className="text-slate-400 mb-4">
          Total Device :
          <span className="text-cyan-400 ml-2">
            {
              filteredDevices.length
            }
          </span>
        </p>

        <div
          className="
            flex
            flex-col
            md:flex-row
            gap-4
            mb-6
          "
        >
          <input
            type="text"
            placeholder="🔍 Search Device..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              bg-slate-800
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              flex-1
              text-white
              outline-none
              focus:border-cyan-500
            "
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value
              )
            }
            className="
              bg-slate-800
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
              outline-none
              focus:border-cyan-500
            "
          >
            <option>
              All
            </option>

            <option>
              Online
            </option>

            <option>
              Warning
            </option>

            <option>
              Offline
            </option>
          </select>

          <button
            onClick={() =>
              setShowModal(
                true
              )
            }
            className="
              px-6
              py-3
              rounded-xl
              bg-cyan-500
              hover:bg-cyan-600
              duration-300
              font-semibold
            "
          >
            Add Device
          </button>

          <button
            onClick={
              exportPDF
            }
            className="
              px-6
              py-3
              rounded-xl
              bg-green-500
              hover:bg-green-600
              duration-300
              font-semibold
            "
          >
            Export PDF
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700">
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
                  Action
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
                    <td className="p-4">
                      {
                        device.hostname
                      }
                    </td>

                    <td className="p-4">
                      {
                        device.ip
                      }
                    </td>

                    <td className="p-4">
                      <span
                        className={getStatusClass(
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
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            openEdit(
                              device
                            )
                          }
                          className="
                            px-4
                            py-2
                            rounded-xl
                            bg-cyan-500
                            hover:bg-cyan-600
                            duration-300
                          "
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteDevice(
                              device
                            )
                          }
                          className="
                            px-4
                            py-2
                            rounded-xl
                            bg-red-500
                            hover:bg-red-600
                            duration-300
                          "
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}

              {filteredDevices.length ===
                0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="
                      text-center
                      text-slate-500
                      py-10
                    "
                  >
                    Device tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div
          className="
            fixed
            inset-0
            bg-black/70
            flex
            items-center
            justify-center
            z-50
            p-4
          "
        >
          <div
            className="
              bg-slate-900
              p-8
              rounded-3xl
              w-full
              max-w-[500px]
              border
              border-slate-700
            "
          >
            <h2 className="text-2xl font-bold mb-6">
              Add Device
            </h2>

            <input
              type="text"
              placeholder="Hostname"
              value={hostname}
              onChange={(e) =>
                setHostname(
                  e.target.value
                )
              }
              className="
                w-full
                p-4
                rounded-xl
                bg-slate-800
                mb-4
                text-white
                outline-none
                border
                border-slate-700
                focus:border-cyan-500
              "
            />

            <input
              type="text"
              placeholder="IP Address"
              value={ip}
              onChange={(e) =>
                setIp(
                  e.target.value
                )
              }
              className="
                w-full
                p-4
                rounded-xl
                bg-slate-800
                mb-4
                text-white
                outline-none
                border
                border-slate-700
                focus:border-cyan-500
              "
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
              className="
                w-full
                p-4
                rounded-xl
                bg-slate-800
                mb-6
                text-white
                outline-none
                border
                border-slate-700
                focus:border-cyan-500
              "
            >
              <option>
                Online
              </option>

              <option>
                Warning
              </option>

              <option>
                Offline
              </option>
            </select>

            <div className="flex gap-4">
              <button
                onClick={
                  addDevice
                }
                className="
                  flex-1
                  bg-cyan-500
                  hover:bg-cyan-600
                  py-3
                  rounded-xl
                  duration-300
                  font-semibold
                "
              >
                Save
              </button>

              <button
                onClick={
                  closeAddModal
                }
                className="
                  flex-1
                  bg-red-500
                  hover:bg-red-600
                  py-3
                  rounded-xl
                  duration-300
                  font-semibold
                "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editModal && (
        <div
          className="
            fixed
            inset-0
            bg-black/70
            flex
            items-center
            justify-center
            z-50
            p-4
          "
        >
          <div
            className="
              bg-slate-900
              p-8
              rounded-3xl
              w-full
              max-w-[500px]
              border
              border-slate-700
            "
          >
            <h2 className="text-2xl font-bold mb-6">
              Edit Device
            </h2>

            <input
              type="text"
              placeholder="Hostname"
              value={hostname}
              onChange={(e) =>
                setHostname(
                  e.target.value
                )
              }
              className="
                w-full
                p-4
                rounded-xl
                bg-slate-800
                mb-4
                text-white
                outline-none
                border
                border-slate-700
                focus:border-cyan-500
              "
            />

            <input
              type="text"
              placeholder="IP Address"
              value={ip}
              onChange={(e) =>
                setIp(
                  e.target.value
                )
              }
              className="
                w-full
                p-4
                rounded-xl
                bg-slate-800
                mb-4
                text-white
                outline-none
                border
                border-slate-700
                focus:border-cyan-500
              "
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
              className="
                w-full
                p-4
                rounded-xl
                bg-slate-800
                mb-6
                text-white
                outline-none
                border
                border-slate-700
                focus:border-cyan-500
              "
            >
              <option>
                Online
              </option>

              <option>
                Warning
              </option>

              <option>
                Offline
              </option>
            </select>

            <div className="flex gap-4">
              <button
                onClick={
                  updateDevice
                }
                className="
                  flex-1
                  bg-cyan-500
                  hover:bg-cyan-600
                  py-3
                  rounded-xl
                  duration-300
                  font-semibold
                "
              >
                Update
              </button>

              <button
                onClick={
                  closeEditModal
                }
                className="
                  flex-1
                  bg-red-500
                  hover:bg-red-600
                  py-3
                  rounded-xl
                  duration-300
                  font-semibold
                "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default DeviceTable;