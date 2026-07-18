import { useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import Navbar from "../component/Navbar";
import Chart from "../component/Chart";

function Analytics({
  currentPage,
  onNavigate,
  onLogout,
}) {
  const [cpu, setCpu] = useState(35);
  const [ram, setRam] = useState(68);
  const [traffic, setTraffic] = useState(72);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(
        Math.floor(Math.random() * 50) + 20
      );

      setRam(
        Math.floor(Math.random() * 40) + 40
      );

      setTraffic(
        Math.floor(Math.random() * 60) + 30
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const systemHealth =
    cpu < 80 && ram < 80
      ? "Healthy"
      : "Warning";

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
              Network Analytics
            </h1>

            <p className="text-slate-400 mt-2">
              Real time network performance and resource analytics.
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-4
              gap-6
            "
          >
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
              <p className="text-slate-400">
                Average CPU
              </p>

              <h2 className="text-4xl font-bold text-cyan-400 mt-3">
                {cpu}%
              </h2>

              <p className="text-sm text-slate-500 mt-3">
                Current processor usage
              </p>
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
              <p className="text-slate-400">
                Average RAM
              </p>

              <h2 className="text-4xl font-bold text-blue-400 mt-3">
                {ram}%
              </h2>

              <p className="text-sm text-slate-500 mt-3">
                Current memory usage
              </p>
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
              <p className="text-slate-400">
                Network Traffic
              </p>

              <h2 className="text-4xl font-bold text-purple-400 mt-3">
                {traffic}%
              </h2>

              <p className="text-sm text-slate-500 mt-3">
                Current traffic load
              </p>
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
              <p className="text-slate-400">
                System Health
              </p>

              <h2
                className={`
                  text-4xl
                  font-bold
                  mt-3
                  ${
                    systemHealth === "Healthy"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }
                `}
              >
                {systemHealth}
              </h2>

              <p className="text-sm text-slate-500 mt-3">
                Overall system condition
              </p>
            </div>
          </div>

          <div
            className="
              mt-8
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
                mb-8
              "
            >
              <div>
                <h2 className="text-2xl font-bold">
                  Live Network Traffic
                </h2>

                <p className="text-slate-400 mt-1">
                  Real time traffic activity
                </p>
              </div>

              <div
                className="
                  px-4
                  py-2
                  bg-green-500/10
                  border
                  border-green-500/20
                  text-green-400
                  rounded-xl
                "
              >
                ● Live
              </div>
            </div>

            <Chart />
          </div>

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-2
              gap-6
              mt-8
            "
          >
            <div
              className="
                bg-slate-900/60
                border
                border-slate-800
                rounded-3xl
                p-6
              "
            >
              <h2 className="text-xl font-bold mb-6">
                Resource Usage
              </h2>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>CPU</span>
                    <span className="text-cyan-400">
                      {cpu}%
                    </span>
                  </div>

                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full duration-500"
                      style={{
                        width: `${cpu}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>RAM</span>
                    <span className="text-blue-400">
                      {ram}%
                    </span>
                  </div>

                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full duration-500"
                      style={{
                        width: `${ram}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Traffic</span>
                    <span className="text-purple-400">
                      {traffic}%
                    </span>
                  </div>

                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full duration-500"
                      style={{
                        width: `${traffic}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              className="
                bg-slate-900/60
                border
                border-slate-800
                rounded-3xl
                p-6
              "
            >
              <h2 className="text-xl font-bold mb-6">
                Performance Summary
              </h2>

              <div className="space-y-5">
                <div className="flex justify-between border-b border-slate-800 pb-4">
                  <span className="text-slate-400">
                    Peak Traffic
                  </span>

                  <span className="font-semibold">
                    92%
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-800 pb-4">
                  <span className="text-slate-400">
                    Average Latency
                  </span>

                  <span className="text-green-400 font-semibold">
                    12 ms
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-800 pb-4">
                  <span className="text-slate-400">
                    Packet Loss
                  </span>

                  <span className="text-green-400 font-semibold">
                    0.2%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Network Uptime
                  </span>

                  <span className="text-green-400 font-semibold">
                    99.99%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Analytics;