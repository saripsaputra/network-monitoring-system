import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      username === "admin" &&
      password === "admin123"
    ) {
      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      setError("");
      onLogin();
    } else {
      setError(
        "Username atau password salah."
      );
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-slate-950
        via-slate-900
        to-black
        text-white
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          bg-slate-900/60
          backdrop-blur-xl
          border
          border-slate-800
          rounded-3xl
          p-8
          shadow-2xl
        "
      >
        <div className="text-center mb-8">
          <div
            className="
              w-16
              h-16
              mx-auto
              mb-5
              rounded-2xl
              bg-cyan-500/20
              border
              border-cyan-500/30
              flex
              items-center
              justify-center
              text-3xl
            "
          >
            ◉
          </div>

          <h1 className="text-3xl font-bold">
            Network Monitor
          </h1>

          <p className="text-slate-400 mt-2">
            Sign in to access your dashboard
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <div>
            <label className="text-sm text-slate-400">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Enter username"
              className="
                w-full
                mt-2
                px-4
                py-3
                rounded-xl
                bg-slate-800
                border
                border-slate-700
                outline-none
                focus:border-cyan-500
              "
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter password"
              className="
                w-full
                mt-2
                px-4
                py-3
                rounded-xl
                bg-slate-800
                border
                border-slate-700
                outline-none
                focus:border-cyan-500
              "
            />
          </div>

          {error && (
            <p
              className="
                text-red-400
                text-sm
                bg-red-500/10
                border
                border-red-500/20
                rounded-xl
                p-3
              "
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="
              w-full
              py-3
              rounded-xl
              bg-cyan-500
              hover:bg-cyan-600
              font-semibold
              duration-300
            "
          >
            Sign In
          </button>
        </form>

        <div
          className="
            mt-8
            pt-6
            border-t
            border-slate-800
            text-center
          "
        >
          <p className="text-sm text-slate-500">
            Network Monitoring System
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;