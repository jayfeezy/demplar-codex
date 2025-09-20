"use client";
import { useNotif } from "@/providers/NotifProvider";
import clsx from "clsx";
import React, { useState } from "react";
// Pure functional component for the main application
const DemplarApp = () => {
  // State management (isolated side effects)
  const [user, setUser] = useState({ role: "master" });
  const [customSubject, setCustomSubject] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const { notify } = useNotif();

  const sendEmail = (subject, body) => {
    const emailAddress = "your@email.com";
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const mailtoLink = `mailto:${emailAddress}?subject=${encodedSubject}&body=${encodedBody}`;

    try {
      window.open(mailtoLink, "_self");
      notify("Opening email client... 📧");
    } catch (error) {
      const emailText = `To: ${emailAddress}\nSubject: ${subject}\n\n${body}`;
      navigator.clipboard
        .writeText(emailText)
        .then(() => {
          notify("Email details copied to clipboard! 📋");
        })
        .catch(() => {
          notify(`Please email: ${emailAddress} with subject: ${subject}`);
        });
    }
  };

  const handleCustomEmail = () => {
    if (!customSubject.trim()) {
      alert("Please enter a subject for your message!");
      return;
    }

    const subject = `Demplar: ${customSubject.trim()}`;
    const body = `Hello!

Subject: ${customSubject.trim()}

Message:
${customMessage.trim() || "[Please add your message here]"}

Details:
- Date: ${new Date().toLocaleDateString()}
- Time: ${new Date().toLocaleTimeString()}

Thank you!`;

    sendEmail(subject, body);
    setCustomSubject("");
    setCustomMessage("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow border p-6">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <span className="mr-3">📧</span>
          Send Suggestions & Feedback
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">
              📋 Custom Message
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Write your own subject and message:
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Line *
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="e.g., Level correction for Captain Cohiba"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={100}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {customSubject.length}/100 characters (will be prefixed with
                  &quot;Demplar: &quot;)
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Add any additional details here..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {customMessage.length}/500 characters
                </div>
              </div>

              <button
                onClick={handleCustomEmail}
                disabled={!customSubject.trim()}
                className={clsx(
                  `w-full py-3 px-6 rounded-lg font-semibold transition-all`,

                  customSubject.trim()
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                )}
              >
                📧 Send Custom Message
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">
              💡 Feedback Ideas
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Some examples of feedback you can send:
            </p>

            <div className="space-y-3">
              {[
                {
                  reason: "Character Update",
                  description: "Report level changes or corrections",
                  icon: "✏️",
                  color: "green",
                },
                {
                  reason: "Bug Report",
                  description: "Search not working, images broken, etc.",
                  icon: "🐛",
                  color: "red",
                },
                {
                  reason: "Feature Request",
                  description: "Ideas for new features",
                  icon: "💡",
                  color: "yellow",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="w-full p-4 rounded-lg border-2 border-gray-200 bg-gray-50"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        {item.reason}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <h5 className="font-semibold text-gray-700 mb-2">📋 Preview:</h5>
              <div className="text-sm text-gray-600 space-y-1">
                <div>
                  <strong>To:</strong> your@email.com
                </div>
                <div>
                  <strong>Subject:</strong> Demplar:{" "}
                  {customSubject || "[Your subject here]"}
                </div>
                <div>
                  <strong>Your Role:</strong> {user?.role || "Unknown"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemplarApp;
