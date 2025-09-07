"use client";
import React, { useState } from "react";
import { characters } from "@/lib/characters";
import { useNotif } from "@/providers/NotifProvider";

// Pure functional component for the main application
const DemplarApp = () => {
  // State management (isolated side effects)
  const [user, setUser] = useState({ role: "master" });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { notify } = useNotif();

  const attemptLogin = () => {
    setErr("");

    if (!username.trim() || !password.trim()) {
      const msg = `${!username.trim() ? "Username" : "Password"} is required!`;
      setErr(msg);
      return false;
    }

    const isValidLogin =
      (username === "master" && password === "123456") ||
      (username === "viewer" && password === "123456") ||
      (username === "guest" && password === "guest");

    if (isValidLogin) {
      setUser({ username: username, role: username });
      setErr("");
      notify(`Welcome ${username}! ⚔️`);
      return true;
    } else {
      setErr("Invalid username or password");
      return false;
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    attemptLogin();
  };

  const quickLogin = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setTimeout(() => {
      setUser({ username: user, role: user });
      setErr("");
      notify(`Welcome ${user}! ⚔️`);
    }, 10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-6 text-center">
          <div className="text-6xl mb-3">🐉</div>
          <h1 className="text-4xl font-bold text-white">DEMPLAR</h1>
          <p className="text-purple-200 mt-1">
            {characters.length} Characters • Complete Database
          </p>
        </div>
        <div className="p-8">
          {err && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm font-medium">
              ⚠️ {err}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter username (try: master)"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter password (try: 123456)"
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-medium transition-colors border-2 border-purple-600 hover:border-purple-700"
            >
              🚀 Enter Realm
            </button>
          </form>

          <div className="mt-6">
            <div className="text-center text-sm text-gray-600 mb-3">
              Quick Login (for testing):
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                ["master", "123456", "👑"],
                ["viewer", "123456", "👁️"],
                ["guest", "guest", "🏃"],
              ].map(([u, p, i]) => (
                <button
                  key={u}
                  onClick={() => quickLogin(u, p)}
                  className={`px-3 py-2 border-2 rounded text-xs hover:opacity-80 transition-opacity ${
                    u === "master"
                      ? "bg-yellow-100 border-yellow-200 text-yellow-800"
                      : "bg-blue-100 border-blue-200 text-blue-800"
                  }`}
                >
                  {i} {u}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemplarApp;
