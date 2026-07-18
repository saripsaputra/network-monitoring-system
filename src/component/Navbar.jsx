import {
  useEffect,
  useState,
} from "react";

function Navbar({
  onLogout,
  onNavigate,
  currentPage = "dashboard",
}) {
  const [time, setTime] =
    useState("");

  const [showProfile, setShowProfile] =
    useState(false);

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  const [adminName, setAdminName] =
    useState(
      () =>
        localStorage.getItem(
          "adminName"
        ) || "SARIP SAPUTRA"
    );

  const [
  notifications,
  setNotifications,
] = useState([]);

useEffect(() => {
  const loadDeviceNotifications = () => {
    const savedDevices =
      localStorage.getItem("devices");

    if (!savedDevices) {
      setNotifications([]);
      return;
    }

    const devices =
      JSON.parse(savedDevices);

    const alerts = devices
      .filter(
        (device) =>
          device.status === "Warning" ||
          device.status === "Offline"
      )
      .map((device, index) => ({
        id: `${device.hostname}-${device.ip}-${index}`,
        title:
          device.status === "Offline"
            ? `${device.hostname} Offline`
            : `${device.hostname} Warning`,
        message:
          device.status === "Offline"
            ? `${device.hostname} dengan IP ${device.ip} sedang offline.`
            : `${device.hostname} dengan IP ${device.ip} membutuhkan perhatian.`,
        type:
          device.status === "Offline"
            ? "danger"
            : "warning",
        read: false,
      }));

    setNotifications(alerts);
  };

  loadDeviceNotifications();

  window.addEventListener(
    "devicesUpdated",
    loadDeviceNotifications
  );

  return () => {
    window.removeEventListener(
      "devicesUpdated",
      loadDeviceNotifications
    );
  };
}, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString(
          "id-ID"
        )
      );
    };

    updateTime();

    const interval = setInterval(
      updateTime,
      1000
    );

    return () =>
      clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateSettings = () => {
      setAdminName(
        localStorage.getItem(
          "adminName"
        ) || "SARIP SAPUTRA"
      );
    };

    window.addEventListener(
      "settingsUpdated",
      updateSettings
    );

    return () => {
      window.removeEventListener(
        "settingsUpdated",
        updateSettings
      );
    };
  }, []);

  const avatarLetter =
    adminName
      .charAt(0)
      .toUpperCase();

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  const pageTitles = {
    dashboard: "Dashboard",
    monitoring: "Monitoring",
    analytics: "Analytics",
    settings: "Settings",
    profile: "My Profile",
  };

  const pageTitle =
    pageTitles[currentPage] ||
    "Dashboard";

  const handleProfile = () => {
    setShowProfile(false);

    if (onNavigate) {
      onNavigate("profile");
    }
  };

  const handleSettings = () => {
    setShowProfile(false);

    if (onNavigate) {
      onNavigate("settings");
    }
  };

  const handleLogout = () => {
    setShowProfile(false);
    setShowNotifications(false);

    if (onLogout) {
      onLogout();
    }
  };

  const handleNotificationToggle =
    () => {
      setShowNotifications(
        !showNotifications
      );

      setShowProfile(false);
    };

  const handleProfileToggle =
    () => {
      setShowProfile(
        !showProfile
      );

      setShowNotifications(false);
    };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(
        (notification) => ({
          ...notification,
          read: true,
        })
      )
    );
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map(
        (notification) =>
          notification.id === id
            ? {
                ...notification,
                read: true,
              }
            : notification
      )
    );
  };

  const getStatusColor = (
    type
  ) => {
    if (type === "danger") {
      return "bg-red-500";
    }

    if (type === "warning") {
      return "bg-yellow-500";
    }

    return "bg-green-500";
  };

  return (
    <div
      className="
        h-20
        bg-slate-900/60
        backdrop-blur-xl
        border-b
        border-slate-800
        flex
        items-center
        justify-between
        px-10
        relative
        z-40
      "
    >
      <h1 className="text-4xl font-bold">
        {pageTitle}
      </h1>

      <div className="flex items-center gap-5">
        <span className="text-slate-400">
          {time}
        </span>

        <div className="relative">
          <button
            onClick={
              handleNotificationToggle
            }
            className="
              relative
              w-12
              h-12
              flex
              items-center
              justify-center
              rounded-xl
              bg-slate-800/70
              border
              border-slate-700
              hover:border-cyan-500/50
              hover:bg-slate-800
              duration-300
              text-xl
            "
          >
            🔔

            {unreadCount > 0 && (
              <span
                className="
                  absolute
                  -top-2
                  -right-2
                  min-w-6
                  h-6
                  px-1
                  rounded-full
                  bg-red-500
                  text-white
                  text-xs
                  font-bold
                  flex
                  items-center
                  justify-center
                  border-2
                  border-slate-900
                "
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="
                absolute
                right-0
                top-16
                w-96
                bg-slate-900
                border
                border-slate-700
                rounded-2xl
                shadow-2xl
                overflow-hidden
                z-50
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  p-5
                  border-b
                  border-slate-800
                "
              >
                <div>
                  <h2 className="font-bold text-lg">
                    Notifications
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    {unreadCount} unread notifications
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={
                      markAllAsRead
                    }
                    className="
                      text-sm
                      text-cyan-400
                      hover:text-cyan-300
                      duration-300
                    "
                  >
                    Mark All as Read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.map(
                  (notification) => (
                    <button
                      key={
                        notification.id
                      }
                      onClick={() =>
                        markAsRead(
                          notification.id
                        )
                      }
                      className={`
                        w-full
                        text-left
                        p-5
                        border-b
                        border-slate-800
                        hover:bg-slate-800/70
                        duration-300

                        ${
                          notification.read
                            ? "opacity-50"
                            : "bg-slate-800/30"
                        }
                      `}
                    >
                      <div className="flex gap-4">
                        <div
                          className={`
                            w-3
                            h-3
                            mt-2
                            rounded-full
                            shrink-0
                            ${getStatusColor(
                              notification.type
                            )}
                          `}
                        />

                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">
                              {
                                notification.title
                              }
                            </p>

                            {!notification.read && (
                              <span
                                className="
                                  text-xs
                                  text-cyan-400
                                "
                              >
                                New
                              </span>
                            )}
                          </div>

                          <p
                            className="
                              text-sm
                              text-slate-400
                              mt-1
                            "
                          >
                            {
                              notification.message
                            }
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                )}
              </div>

              {unreadCount === 0 && (
                <div
                  className="
                    p-4
                    text-center
                    text-sm
                    text-green-400
                  "
                >
                  ✓ All notifications read
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={
              handleProfileToggle
            }
            className="
              flex
              items-center
              gap-4
              hover:bg-slate-800
              px-3
              py-2
              rounded-xl
              duration-300
            "
          >
            <div
              className="
                w-12
                h-12
                rounded-full
                bg-cyan-500
                flex
                items-center
                justify-center
                font-bold
                text-white
              "
            >
              {avatarLetter}
            </div>

            <div className="text-left">
              <p className="font-semibold">
                {adminName}
              </p>

              <p className="text-xs text-slate-400">
                Administrator
              </p>
            </div>

            <span className="text-slate-400">
              ▼
            </span>
          </button>

          {showProfile && (
            <div
              className="
                absolute
                right-0
                top-16
                w-64
                bg-slate-900
                border
                border-slate-700
                rounded-2xl
                shadow-2xl
                overflow-hidden
                z-50
              "
            >
              <div
                className="
                  p-5
                  border-b
                  border-slate-800
                "
              >
                <p className="font-bold">
                  {adminName}
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  Network Administrator
                </p>
              </div>

              <div className="p-3">
                <button
                  onClick={
                    handleProfile
                  }
                  className="
                    w-full
                    text-left
                    px-4
                    py-3
                    rounded-xl
                    hover:bg-slate-800
                    duration-300
                  "
                >
                  👤 My Profile
                </button>

                <button
                  onClick={
                    handleSettings
                  }
                  className="
                    w-full
                    text-left
                    px-4
                    py-3
                    rounded-xl
                    hover:bg-slate-800
                    duration-300
                  "
                >
                  ⚙ Settings
                </button>

                <button
                  onClick={
                    handleLogout
                  }
                  className="
                    w-full
                    text-left
                    px-4
                    py-3
                    rounded-xl
                    text-red-400
                    hover:bg-red-500/10
                    duration-300
                  "
                >
                  ⏻ Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;