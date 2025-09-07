"use client";
import React, { useState } from "react";
import { NewsArticle } from "@/components/NewsArticle";
import { useNotif } from "@/providers/NotifProvider";

// Pure functional component for the main application
const DemplarApp = () => {
  // State management (isolated side effects)
  const [user, setUser] = useState({ role: "master" });
  const { notify } = useNotif();
  const [newNewsTitle, setNewNewsTitle] = useState("");
  const [newNewsContent, setNewNewsContent] = useState("");
  const [newsEntries, setNewsEntries] = useState([
    {
      id: 2,
      date: "2025-06-16",
      title: "[The Demplar Times] The Shadowmera Crisis",
      content:
        "Character players had been thrown in a loop, literally. It took them 2 game nights to be free from this never ending almost game finisher... We have seen similarities of Shadowmera to Kuja from FFIX as well as similarities of Ultimecia from FFVIII, this being Shadowmera Perfect form was a player character's shadow fused with a mythical sentient being called Leonidas from the compression of time....",
      author: "@DemplarOfficial",
    },
    {
      id: 1,
      date: "2025-06-03",
      title: "The Dark Portal Expedition",
      content:
        "Adventurers have travelled 1 month in real-time to visit Luminous, they have been moving deep in the caverns, befriending a mythical sentient being named Leonidas, encountered a massive Luminous Golem and defeated both a Luminous Bat & a Luminous T-Rex!",
      author: "@DemplarOfficial",
    },
  ]);

  const addNewsEntry = () => {
    if (!newNewsTitle.trim() || !newNewsContent.trim()) {
      alert("Please fill in both title and content for the news article!");
      return;
    }

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      title: newNewsTitle.trim(),
      content: newNewsContent.trim(),
      author: user?.role === "master" ? "Demplar News Team" : "Guest Reporter",
    };

    setNewsEntries((prev) => [newEntry, ...prev]);
    setNewNewsTitle("");
    setNewNewsContent("");
    notify("News article published! 📰");
  };

  const deleteNewsEntry = (id) => {
    if (window.confirm("Are you sure you want to delete this news article?")) {
      setNewsEntries((prev) => prev.filter((entry) => entry.id !== id));
      notify("News article deleted! 🗑️");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow border p-6">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <span className="mr-3">📰</span>
          Demplar News & Chronicles
        </h3>

        {user.role === "master" && (
          <div className="mb-8 p-6 border-2 rounded-xl bg-blue-50 border-blue-200">
            <h4 className="text-lg font-semibold mb-4 flex items-center text-blue-800">
              <span className="mr-2">✍️</span>
              Publish New Article
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Article Title *
                </label>
                <input
                  type="text"
                  value={newNewsTitle}
                  onChange={(e) => setNewNewsTitle(e.target.value)}
                  placeholder="e.g., The Battle of Luminous"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  maxLength={200}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {newNewsTitle.length}/200 characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Article Content *
                </label>
                <textarea
                  value={newNewsContent}
                  onChange={(e) => setNewNewsContent(e.target.value)}
                  placeholder="Write about the latest events, discoveries, or updates...

You can write detailed articles with multiple paragraphs. Use line breaks to separate sections for better readability.

Tips for formatting:
- Press Enter twice for paragraph breaks
- Use --- on its own line for section dividers
- Start lines with • for bullet points"
                  rows={12}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white border-gray-300 text-gray-900 placeholder-gray-500 font-sans"
                  maxLength={10000}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {newNewsContent.length}/10,000 characters
                </div>
              </div>

              <button
                onClick={addNewsEntry}
                disabled={!newNewsTitle.trim() || !newNewsContent.trim()}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  newNewsTitle.trim() && newNewsContent.trim()
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                📰 Publish Article
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {newsEntries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📰</div>
              <p className="text-lg">No news articles yet</p>
              <p className="text-sm">The newsroom awaits its first story...</p>
            </div>
          ) : (
            newsEntries
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((entry, index) => (
                <NewsArticle
                  key={entry.id}
                  entry={entry}
                  index={index}
                  isLatest={index === 0}
                  onDelete={deleteNewsEntry}
                  canDelete={user.role === "master"}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DemplarApp;
