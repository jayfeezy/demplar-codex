"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Shield, Eye, Download } from "lucide-react";
import { ProfileImage } from "@/components/ProfileImage";
import { useNotif } from "@/providers/NotifProvider";
import { useChar } from "@/providers/CharProvider";

// Pure functional component for the main application
const DemplarApp = () => {
  // State management (isolated side effects)
  const [user, setUser] = useState({ role: "master" });
  const { chars, setChars, sel, setSel } = useChar();
  const { notify } = useNotif();

  const update = (id, field, val) => {
    setChars((p) => p.map((c) => (c.id === id ? { ...c, [field]: val } : c)));
    if (sel?.id === id) setSel((p) => ({ ...p, [field]: val }));
  };

  const exp = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([`const characters=${JSON.stringify(chars, null, 2)};`], {
        type: "text/javascript",
      })
    );
    a.download = "demplar-chars.js";
    a.click();
    notify("Exported! 📊");
  };

  return (
    <>
      {user.role === "master" && (
        <div className="rounded-xl shadow border bg-white border-gray-200">
          <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 bg-red-50 border-gray-200">
            <h3 className="text-xl sm:text-2xl font-bold flex items-center text-red-800">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Admin Panel
            </h3>
            <button
              onClick={exp}
              className="w-full sm:w-auto px-4 py-2 rounded flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="w-4 h-4" />
              <span>Export All</span>
            </button>
          </div>
          <div className="p-4 sm:p-6">
            <div className="block sm:hidden space-y-4 max-h-96 overflow-y-auto">
              {chars.map((c) => (
                <div
                  key={c.id}
                  className="border rounded-lg p-4 space-y-3 border-gray-200 bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <ProfileImage
                      src={c.profileUrl}
                      alt={c.name}
                      size="w-12 h-12"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) => update(c.id, "name", e.target.value)}
                        className="font-medium w-full border rounded px-2 py-1 text-sm bg-transparent border-gray-300 text-gray-900"
                      />
                      <div className="text-xs mt-1 text-gray-500">#{c.id}</div>
                    </div>
                    <Link
                      onClick={() => {
                        setSel(c);
                        notify(`Viewing ${c.name} ⚔️`);
                      }}
                      href="profile"
                      className="px-3 py-2 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500">Level</label>
                      <input
                        type="number"
                        value={c.level}
                        onChange={(e) =>
                          update(c.id, "level", +e.target.value || 0)
                        }
                        className="w-full border rounded px-2 py-1 text-sm font-bold border-gray-300 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">X Handle</label>
                      <input
                        type="text"
                        value={c.twitterHandle}
                        onChange={(e) =>
                          update(c.id, "twitterHandle", e.target.value)
                        }
                        placeholder="@username"
                        className="w-full border rounded px-2 py-1 text-xs border-gray-300 text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Class</label>
                    <input
                      type="text"
                      value={c.className}
                      onChange={(e) =>
                        update(c.id, "className", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1 text-sm border-gray-300 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Location</label>
                    <input
                      type="text"
                      value={c.location}
                      onChange={(e) => update(c.id, "location", e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm border-gray-300 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Profile URL</label>
                    <input
                      type="url"
                      value={c.profileUrl}
                      onChange={(e) =>
                        update(c.id, "profileUrl", e.target.value)
                      }
                      placeholder="https://..."
                      className="w-full border rounded px-2 py-1 text-xs border-gray-300 text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden sm:block overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm text-gray-900">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b bg-gray-50 border-gray-200">
                    {[
                      "Character",
                      "Level",
                      "Class",
                      "Location",
                      "X Handle",
                      "Profile URL",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left p-3 text-gray-700 bg-gray-50"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chars.map((c, i) => (
                    <tr
                      key={c.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 ${
                        i % 2 ? "bg-gray-25" : "bg-white"
                      }`}
                    >
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <ProfileImage
                            src={c.profileUrl}
                            alt={c.name}
                            size="w-8 h-8"
                          />
                          <div>
                            <input
                              type="text"
                              value={c.name}
                              onChange={(e) =>
                                update(c.id, "name", e.target.value)
                              }
                              className="font-medium bg-transparent border-none focus:border focus:rounded px-2 py-1 text-gray-900 focus:bg-white focus:border-blue-300 min-w-[120px]"
                            />
                            <div className="text-xs text-gray-500">#{c.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={c.level}
                          onChange={(e) =>
                            update(c.id, "level", +e.target.value || 0)
                          }
                          className="w-16 text-center font-bold bg-transparent border-none focus:border focus:rounded px-2 py-1 text-gray-900 focus:bg-white focus:border-blue-300"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={c.className}
                          onChange={(e) =>
                            update(c.id, "className", e.target.value)
                          }
                          className="bg-transparent border-none focus:border focus:rounded px-2 py-1 max-w-[150px] text-gray-900 focus:bg-white focus:border-blue-300"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={c.location}
                          onChange={(e) =>
                            update(c.id, "location", e.target.value)
                          }
                          className="bg-transparent border-none focus:border focus:rounded px-2 py-1 max-w-[120px] text-gray-900 focus:bg-white focus:border-blue-300"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={c.twitterHandle}
                          onChange={(e) =>
                            update(c.id, "twitterHandle", e.target.value)
                          }
                          placeholder="@username"
                          className="bg-transparent border-none focus:border focus:rounded px-2 py-1 max-w-[100px] text-xs text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-300"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="url"
                          value={c.profileUrl}
                          onChange={(e) =>
                            update(c.id, "profileUrl", e.target.value)
                          }
                          placeholder="https://..."
                          className="bg-transparent border-none focus:border focus:rounded px-2 py-1 max-w-[150px] text-xs text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-300"
                        />
                      </td>
                      <td className="p-3">
                        <Link
                          onClick={() => {
                            setSel(c);
                            notify(`Viewing ${c.name} ⚔️`);
                          }}
                          href="profile"
                          className="px-2 py-1 rounded text-xs bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Eye className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600 text-center">
              Managing all {chars.length} characters. Changes are saved
              automatically.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DemplarApp;
