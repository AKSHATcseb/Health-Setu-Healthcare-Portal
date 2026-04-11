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
  const [submitting, setSubmitting] = useState(false); // local immediate guard

  // initialize note when modal opens or payload changes
  useEffect(() => {
    if (open) {
      setNote((payload && (payload.note || payload.adminNote || "")) || "");
      setSubmitting(false);
    } else {
      setNote("");
      setSubmitting(false);
    }
  }, [open, payload]);

  if (!open) return null;

  const isBusy = loading || submitting;
  const canConfirm = !isBusy && (!requireNote || !!note.trim());

  const handleConfirm = () => {
    if (!canConfirm) return;

    // immediate local guard to avoid double clicks if parent updates loading slightly later
    setSubmitting(true);

    const out = { ...(payload || {}), note: note.trim() || "" };
    // call parent handler; parent is responsible for setting loading state
    onConfirm(out);
    // do not reset submitting here; will be reset when modal closes or loading becomes false via props
  };

  const handleClose = () => {
    if (isBusy) return; // prevent closing while request in-flight
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black opacity-30"
        onClick={handleClose}
        aria-hidden="true"
      />
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
            disabled={isBusy}
            aria-disabled={isBusy}
          />
        ) : null}

        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className={`px-4 py-2 text-sm text-gray-700 rounded-md ${isBusy ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-100"}`}
            disabled={isBusy}
            aria-disabled={isBusy}
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            aria-disabled={!canConfirm}
            className={`px-4 py-2 text-sm text-white rounded-md ${
              !canConfirm ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isBusy ? "Please wait..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}