import React from "react";

export function LoadingSpinner() {
  return (
    <div className="flex justify-center">
      <div
        className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"
        aria-label="Loading..."
      />
    </div>
  );
}
