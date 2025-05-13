import React, { useState } from "react";

function ProjectLog({ projectId, onLogAdded }) {
  const [content, setContent] = useState("");
  // File input is disabled for now

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await onLogAdded({ project: projectId, content });
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-y-2 mt-4">
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Enter log content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type="file"
        className="block"
        disabled
        title="File attachment coming soon"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Log
      </button>
    </form>
  );
}

export default ProjectLog;