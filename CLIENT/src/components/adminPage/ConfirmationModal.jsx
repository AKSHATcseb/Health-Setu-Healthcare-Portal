import React, { useState, useEffect } from "react";

/**
 * Props:
 * - open (bool)
 * - title (string)
 * - description (string)
 * - onClose()
 * - onConfirm(payload)  // passes payload object (should contain at least _id), e.g. { _id, note }
 * - requireNote (bool)
 * - payload (object)    // original item
 * - loading (bool)      // disable confirm while true
 */
export default function ConfirmationModal({
  open,
  title,
  description,
  onClose = () => {},
  onConfirm = () => {},
  requireNote = false,
  payload = null,
  loading = false,
}) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) setNote("");
  }, [open]);

  if (!open) return null;

  const handleConfirm = () => {
    if (requireNote && !note.trim()) return;
    const out = { ...(payload || {}), note: note.trim() || "" };
    onConfirm(out);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg z-10 max-w-lg w-full p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>

        {requireNote ? (
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
            placeholder="Provide details..."
            rows={4}
          />
        ) : null}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-700">Cancel</button>
          <button
            onClick={handleConfirm}
            disabled={loading || (requireNote && !note.trim())}
            className={`px-4 py-2 text-sm text-white rounded-md ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Please wait..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}