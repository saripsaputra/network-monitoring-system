import { useState } from "react";
import Sidebar from "../component/Sidebar";
import Navbar from "../component/Navbar";

function Settings({
  currentPage,
  onNavigate,
  onLogout,
}) {
  const [systemName, setSystemName] = useState(
    () =>
      localStorage.getItem("systemName") ||
      "Network Monitoring System"
  );

  const [adminName, setAdminName] = useState(
    () =>
      localStorage.getItem("adminName") ||
      "SARIP SAPUTRA"
  );

  const [message, setMessage] = useState("");

  const saveSettings = () => {
    localStorage.setItem(
      "systemName",
      systemName
    );

    localStorage.setItem(
      "adminName",
      adminName
    );

    setMessage(
      "Settings berhasil disimpan!"
    );

    window.dispatchEvent(
      new Event("settingsUpdated")
    );

    setTimeout(() => {
      setMessage("");
    }, 3000);
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
        currentPage={currentPage}
        onNavigate={onNavigate}
      />

      <div className="flex-1 min-w-0">
        <Navbar 
         onLogout={onLogout}
         onNavigate={onNavigate}
        />

        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Settings
            </h1>

            <p className="text-slate-400 mt-2">
              Manage your Network Monitoring System settings.
            </p>
          </div>

          <div
            className="
              max-w-3xl
              bg-slate-900/60
              backdrop-blur-xl
              border
              border-slate-800
              rounded-3xl
              p-8
            "
          >
            <h2 className="text-2xl font-bold">
              System Settings
            </h2>

            <p className="text-slate-400 mt-2">
              Configure your system information.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <label className="text-slate-400">
                  System Name
                </label>

                <input
                  type="text"
                  value={systemName}
                  onChange={(e) =>
                    setSystemName(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    mt-2
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
                />
              </div>

              <div>
                <label className="text-slate-400">
                  Administrator Name
                </label>

                <input
                  type="text"
                  value={adminName}
                  onChange={(e) =>
                    setAdminName(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    mt-2
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
                />
              </div>

              {message && (
                <div
                  className="
                    bg-green-500/10
                    border
                    border-green-500/30
                    text-green-400
                    rounded-xl
                    px-4
                    py-3
                  "
                >
                  {message}
                </div>
              )}

              <button
                onClick={saveSettings}
                className="
                  bg-cyan-500
                  hover:bg-cyan-600
                  px-6
                  py-3
                  rounded-xl
                  font-semibold
                  duration-300
                "
              >
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;