import { useEffect, useState } from "react";

import {
  FaHome,
  FaChartBar,
  FaCog,
  FaServer,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

function Sidebar({
  onNavigate,
  currentPage = "dashboard",
}) {
  const [isCollapsed, setIsCollapsed] =
    useState(false);

  const [systemName, setSystemName] =
    useState(
      () =>
        localStorage.getItem(
          "systemName"
        ) || "Network Monitoring System"
    );

  useEffect(() => {
    const updateSettings = () => {
      setSystemName(
        localStorage.getItem(
          "systemName"
        ) || "Network Monitoring System"
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

  const menuItems = [
    {
      name: "Dashboard",
      page: "dashboard",
      icon: <FaHome />,
    },
    {
      name: "Monitoring",
      page: "monitoring",
      icon: <FaServer />,
    },
    {
      name: "Analytics",
      page: "analytics",
      icon: <FaChartBar />,
    },
    {
      name: "Settings",
      page: "settings",
      icon: <FaCog />,
    },
  ];

  const handleNavigate = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div
      className={`
        ${isCollapsed ? "w-24" : "w-72"}
        min-h-screen
        bg-slate-900/80
        backdrop-blur-xl
        border-r
        border-slate-800
        relative
        transition-all
        duration-300
        flex
        flex-col
        shrink-0
      `}
    >
      <button
        onClick={() =>
          setIsCollapsed(!isCollapsed)
        }
        className="
          absolute
          top-8
          -right-4
          w-9
          h-9
          bg-cyan-500
          hover:bg-cyan-400
          rounded-full
          flex
          items-center
          justify-center
          text-white
          shadow-lg
          z-50
          transition
          duration-300
        "
      >
        {isCollapsed ? (
          <FaChevronRight />
        ) : (
          <FaChevronLeft />
        )}
      </button>

      <div
        className={`
          ${isCollapsed ? "px-4" : "px-8"}
          pt-8
          transition-all
          duration-300
        `}
      >
        <h1
          className={`
            font-bold
            bg-gradient-to-r
            from-cyan-400
            to-blue-500
            bg-clip-text
            text-transparent
            transition-all
            duration-300

            ${
              isCollapsed
                ? "text-2xl text-center"
                : "text-5xl"
            }
          `}
        >
          {isCollapsed ? "N" : "NMS"}
        </h1>

        {!isCollapsed && (
          <p
            className="
              text-slate-500
              mt-2
              text-sm
            "
          >
            {systemName}
          </p>
        )}
      </div>

      <ul
        className={`
          mt-16
          space-y-5
          ${isCollapsed ? "px-4" : "px-8"}
        `}
      >
        {menuItems.map((item) => {
          const isActive =
            currentPage === item.page;

          return (
            <li
              key={item.page}
              onClick={() =>
                handleNavigate(item.page)
              }
              title={
                isCollapsed
                  ? item.name
                  : ""
              }
              className={`
                flex
                items-center
                p-4
                rounded-2xl
                cursor-pointer
                transition-all
                duration-300

                ${
                  isCollapsed
                    ? "justify-center"
                    : "gap-4"
                }

                ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "text-white hover:bg-slate-800 hover:text-cyan-400 border border-transparent"
                }
              `}
            >
              <span className="text-xl shrink-0">
                {item.icon}
              </span>

              {!isCollapsed && (
                <span>
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {!isCollapsed && (
        <div
          className="
            mt-auto
            mx-8
            mb-8
            bg-slate-800
            rounded-2xl
            p-5
          "
        >
          <p className="text-slate-400 text-sm">
            Server Status
          </p>

          <h2 className="text-green-400 text-xl font-bold mt-2">
            ● Online
          </h2>

          <p className="text-slate-500 text-sm mt-2">
            Uptime 99.99%
          </p>
        </div>
      )}

      {isCollapsed && (
        <div
          className="
            mt-auto
            mb-8
            flex
            justify-center
          "
          title="Server Online"
        >
          <div
            className="
              w-3
              h-3
              bg-green-400
              rounded-full
            "
          />
        </div>
      )}
    </div>
  );
}

export default Sidebar;