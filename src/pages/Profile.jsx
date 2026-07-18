import { useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import Navbar from "../component/Navbar";

function Profile({
  currentPage,
  onNavigate,
  onLogout,
}) {
  const [adminName, setAdminName] = useState(
    () =>
      localStorage.getItem("adminName") ||
      "SARIP SAPUTRA"
  );

  const [systemName, setSystemName] = useState(
    () =>
      localStorage.getItem("systemName") ||
      "Network Monitoring System"
  );

  useEffect(() => {
    const updateProfile = () => {
      setAdminName(
        localStorage.getItem("adminName") ||
          "SARIP SAPUTRA"
      );

      setSystemName(
        localStorage.getItem("systemName") ||
          "Network Monitoring System"
      );
    };

    window.addEventListener(
      "settingsUpdated",
      updateProfile
    );

    return () => {
      window.removeEventListener(
        "settingsUpdated",
        updateProfile
      );
    };
  }, []);

  const avatarLetter = adminName
    .charAt(0)
    .toUpperCase();

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
              My Profile
            </h1>

            <p className="text-slate-400 mt-2">
              Administrator profile information.
            </p>
          </div>

          <div
            className="
              max-w-4xl
              bg-slate-900/60
              backdrop-blur-xl
              border
              border-slate-800
              rounded-3xl
              overflow-hidden
            "
          >
            <div
              className="
                h-32
                bg-gradient-to-r
                from-cyan-500/30
                via-blue-500/20
                to-purple-500/20
              "
            />

            <div className="px-8 pb-8">
              <div
                className="
                  flex
                  flex-col
                  md:flex-row
                  md:items-end
                  md:justify-between
                  gap-6
                "
              >
                <div
                  className="
                    flex
                    items-end
                    gap-6
                  "
                >
                  <div
                    className="
                      w-28
                      h-28
                      -mt-14
                      rounded-full
                      bg-cyan-500
                      border-4
                      border-slate-900
                      flex
                      items-center
                      justify-center
                      text-4xl
                      font-bold
                      shadow-xl
                    "
                  >
                    {avatarLetter}
                  </div>

                  <div className="pb-2">
                    <h2 className="text-2xl font-bold">
                      {adminName}
                    </h2>

                    <p className="text-cyan-400 mt-1">
                      Network Administrator
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    onNavigate("settings")
                  }
                  className="
                    px-6
                    py-3
                    bg-cyan-500
                    hover:bg-cyan-600
                    rounded-xl
                    font-semibold
                    duration-300
                  "
                >
                  Edit Profile
                </button>
              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-6
                  mt-10
                "
              >
                <div
                  className="
                    bg-slate-800/50
                    border
                    border-slate-700
                    rounded-2xl
                    p-6
                  "
                >
                  <p className="text-slate-400">
                    Administrator
                  </p>

                  <p className="text-lg font-semibold mt-2">
                    {adminName}
                  </p>
                </div>

                <div
                  className="
                    bg-slate-800/50
                    border
                    border-slate-700
                    rounded-2xl
                    p-6
                  "
                >
                  <p className="text-slate-400">
                    Role
                  </p>

                  <p className="text-lg font-semibold mt-2">
                    Network Administrator
                  </p>
                </div>

                <div
                  className="
                    bg-slate-800/50
                    border
                    border-slate-700
                    rounded-2xl
                    p-6
                  "
                >
                  <p className="text-slate-400">
                    System
                  </p>

                  <p className="text-lg font-semibold mt-2">
                    {systemName}
                  </p>
                </div>

                <div
                  className="
                    bg-slate-800/50
                    border
                    border-slate-700
                    rounded-2xl
                    p-6
                  "
                >
                  <p className="text-slate-400">
                    Account Status
                  </p>

                  <p className="text-green-400 text-lg font-semibold mt-2">
                    ● Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;