"use client";
import React, { useState } from "react";
import { formatContent } from "./formatContent";
import { ChevronDown } from "lucide-react";

// Pure functional component for power bars
export const NewsArticle = ({
  entry,
  index,
  isLatest,
  onDelete,
  canDelete,
}) => {
  const [showFull, setShowFull] = useState(false);
  const previewLength = 300; // Characters to show in preview
  const isLongArticle = entry.content.length > previewLength;

  return (
    <article
      className={`rounded-xl border-2 transition-all hover:shadow-lg duration-300 ${
        isLatest
          ? "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300"
          : "bg-gray-50 border-gray-200 hover:border-gray-300"
      }`}
    >
      {/* Article Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-start space-x-3 mb-3">
              <h4
                className={`text-xl lg:text-2xl font-bold leading-tight ${
                  isLatest ? "text-blue-800" : "text-gray-800"
                }`}
              >
                {entry.title}
              </h4>
              {isLatest && (
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-200 text-blue-800 whitespace-nowrap mt-1">
                  Latest
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <span>📅</span>
                <time dateTime={entry.date}>
                  {new Date(entry.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center space-x-1">
                <span>✍️</span>
                <span>{entry.author}</span>
              </div>
              {entry.content.length > 500 && (
                <div className="flex items-center space-x-1">
                  <span>📖</span>
                  <span>
                    {Math.ceil(entry.content.split(" ").length / 200)} min read
                  </span>
                </div>
              )}
            </div>
          </div>

          {canDelete && (
            <button
              onClick={() => onDelete(entry.id)}
              className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 ml-4"
              title="Delete article"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div
        className={`px-6 pb-6 ${isLatest ? "text-gray-700" : "text-gray-600"}`}
      >
        {isLongArticle && !showFull ? (
          <>
            <div className="prose prose-sm sm:prose-base max-w-none">
              <p className="leading-relaxed">
                {entry.content.substring(0, previewLength)}...
              </p>
            </div>
            <button
              onClick={() => setShowFull(true)}
              className={`mt-4 px-4 py-2 rounded-lg font-medium text-sm transition-all inline-flex items-center gap-2 ${
                isLatest
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <span>📖</span>
              <span>Read Full Article</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <div className="prose prose-sm sm:prose-base max-w-none">
              <div className="article-content">
                {formatContent(entry.content)}
              </div>
            </div>
            {isLongArticle && (
              <button
                onClick={() => setShowFull(false)}
                className={`mt-4 px-4 py-2 rounded-lg font-medium text-sm transition-all inline-flex items-center gap-2 ${
                  isLatest
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <span>📖</span>
                <span>Show Less</span>
                <ChevronDown className="w-4 h-4 rotate-180" />
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
};
