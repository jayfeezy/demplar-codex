"use client";
import React from "react";

// Process content for better formatting
export const formatContent = (content) => {
  // Split by double line breaks for paragraphs
  const paragraphs = content.split(/\n\n+/);

  return paragraphs.map((paragraph, pIndex) => {
    // Check for horizontal rule
    if (paragraph.trim() === "---") {
      return <hr key={pIndex} className="my-6 border-gray-300" />;
    }

    // Check for bullet points
    if (paragraph.trim().startsWith("•")) {
      const items = paragraph
        .split("\n")
        .filter((line) => line.trim().startsWith("•"));
      return (
        <ul key={pIndex} className="list-none space-y-2 my-4">
          {items.map((item, iIndex) => (
            <li key={iIndex} className="flex">
              <span className="mr-2 text-gray-500">•</span>
              <span className="flex-1">{item.replace(/^•\s*/, "")}</span>
            </li>
          ))}
        </ul>
      );
    }

    // Regular paragraph
    return (
      <p key={pIndex} className="leading-relaxed mb-4 last:mb-0">
        {paragraph.split("\n").map((line, lIndex) => (
          <React.Fragment key={lIndex}>
            {line}
            {lIndex < paragraph.split("\n").length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    );
  });
};
