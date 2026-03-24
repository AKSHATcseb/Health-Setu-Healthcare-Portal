import React, { useState, useEffect } from "react";

/**
 * Props:
 * - open (bool)
 * - item (object)
 * - onClose()
 * - onAction(action, item, note?)  // action: "accepted"|"rejected"|"changes_requested"
 */
export default function HospitalDetailsDrawer({ open, item, onClose = () => {}, onAction = () => {} }) {
  const [noteMode, setNoteMode] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) {
      setNoteMode(false);
      setNote("");
    }
  }, [open, item]);

  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="w-full max-w-2xl ml-auto bg-white shadow-xl h-full overflow-auto">
        <div className="p-6 border-b">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">{item.hospitalName}</h2>
              <p className="text-sm text-gray-500">{item.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-900">Close</button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600">Registration Number</h3>
            <div className="text-sm text-gray-800">{item.registrationNumber || "-"}</div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600">Address</h3>
            <div className="text-sm text-gray-800">{item.address || "-"}</div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600">Dialysis Type / Seats</h3>
            <div className="text-sm text-gray-800">
              {item.dialysisType || "-"} {item.dialysisSeats ? ` / ${item.dialysisSeats} seats` : ""}
            </div>
          </div>

          {item.documents?.length ? (
            <div>
              <h3 className="text-sm font-medium text-gray-600">Documents</h3>
              <ul className="text-sm text-gray-800 list-disc ml-5">
                {item.documents.map((d, i) => (
                  <li key={i}>
                    {d.url ? <a className="text-indigo-600" href={d.url} target="_blank" rel="noreferrer">{d.name || d.url}</a> : d.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="p-6 border-t flex items-center justify-end gap-3">
          {/* Inline note input toggled when admin wants to request changes from inside drawer */}
          {noteMode ? (
            <>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Describe required changes..."
                className="w-full max-w-lg p-2 border rounded-md"
              />
              <button
                onClick={() => {
                  onAction("changes_requested", item, note);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
              >
                Send changes request
              </button>
              <button onClick={() => setNoteMode(false)} className="px-3 py-2 text-sm text-gray-600">Cancel</button>
            </>
          ) : (
            <>
              <button
                onClick={() => onAction("accepted", item)}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Accept
              </button>

              <button
                onClick={() => setNoteMode(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
              >
                Request changes
              </button>

              <button
                onClick={() => onAction("rejected", item)}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      {/* overlay to close */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}