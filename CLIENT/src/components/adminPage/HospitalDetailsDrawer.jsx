import React, { useState, useEffect } from "react";

export default function HospitalDetailsDrawer({
  open,
  item,
  onClose = () => {},
  onAction = () => {},
  actionsDisabled = false, // NEW: when true, disable all action buttons / inputs
}) {
  const [noteMode, setNoteMode] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) {
      setNoteMode(false);
      setNote("");
    }
  }, [open, item]);

  if (!open || !item) return null;

  const Section = ({ title, children }) => (
    <div className="border-b pb-4">
      <h3 className="text-sm font-semibold text-gray-600 mb-2">{title}</h3>
      <div className="text-sm text-gray-800 space-y-1">{children}</div>
    </div>
  );

  const renderSlots = (slots = []) =>
    slots.length ? (
      slots.map((s, i) => (
        <div key={i} className="text-xs bg-gray-100 px-2 py-1 rounded inline-block mr-2 mb-2">
          {s.start} - {s.end}
        </div>
      ))
    ) : (
      <span className="text-gray-400">No slots</span>
    );

  // disable actions when either global actionsDisabled is true
  const disabledAll = !!actionsDisabled;

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="w-full max-w-3xl ml-auto bg-white shadow-xl h-full overflow-auto">
        {/* HEADER */}
        <div className="p-6 border-b">
          <div className="flex justify-between">
            <div>
              <h2 className="text-xl font-semibold">{item.hospitalName}</h2>
              <p className="text-sm text-gray-500">{item.email}</p>
            </div>
            <button
              onClick={onClose}
              className="text-sm text-gray-600"
              aria-disabled={false}
            >
              Close
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* BASIC INFO */}
          <Section title="Basic Information">
            <div>Registration: {item.registrationNumber}</div>
            <div>Phone: {item.phone}</div>
            <div>Status: {item.status}</div>
          </Section>

          {/* LOCATION */}
          <Section title="Location">
            <div>Address: {item.address || "-"}</div>
          </Section>

          {/* DIALYSIS */}
          <Section title="Dialysis Details">
            <div>Type: {item.dialysisType}</div>
            <div>Seats: {item.dialysisSeats}</div>
          </Section>

          {/* PRICING */}
          <Section title="Pricing">
            <div>4 Hr: ₹ {item.priceFor4Hrs ?? "-"}</div>
            <div>6 Hr: ₹ {item.priceFor6Hrs ?? "-"}</div>
            <div>Peritoneal: ₹ {item.priceForPD ?? "-"}</div>
          </Section>

          {/* OPERATING HOURS */}
          <Section title="Operating Days">
            {item.is24x7 ? (
              <div>24x7 Open</div>
            ) : (
              Object.entries(item.operatingHours || {}).map(([day, val]) => (
                <div key={day}>
                  {day}: {val?.closed ? "Closed" : "Open"}
                </div>
              ))
            )}
          </Section>

          {/* SLOTS */}
          <Section title="Dialysis Slots">
            <div>
              <p className="font-medium">4 Hour Slots</p>
              {renderSlots(item?.slots?.slots4h)}
            </div>

            <div>
              <p className="font-medium mt-2">6 Hour Slots</p>
              {renderSlots(item?.slots?.slots6h)}
            </div>
          </Section>

          {/* BANK DETAILS */}
          <Section title="Bank Details">
            <div>Account Holder: {item.accountHolderName || "-"}</div>
            <div>Bank: {item.bankName || "-"}</div>
            <div>Account No: {item.accountNumber || "-"}</div>
            <div>IFSC: {item.ifscCode || "-"}</div>
          </Section>

          {/* DOCUMENTS */}
          {item.documents?.length ? (
            <Section title="Documents">
              {item.documents.map((d, i) => (
                <div key={i}>
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600"
                  >
                    {d.name || d.url}
                  </a>
                </div>
              ))}
            </Section>
          ) : null}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-6 border-t flex flex-col gap-3">
          {noteMode ? (
            <>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Describe required changes..."
                className="w-full p-2 border rounded-md"
                disabled={disabledAll}
                aria-disabled={disabledAll}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (disabledAll) return;
                    onAction("changes_requested", item, note);
                  }}
                  disabled={disabledAll}
                  aria-disabled={disabledAll}
                  className={`px-4 py-2 rounded-md text-white ${
                    disabledAll ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  Send changes
                </button>
                <button
                  onClick={() => setNoteMode(false)}
                  className="px-3 py-2 text-sm text-gray-600"
                  disabled={false}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  if (disabledAll) return;
                  onAction("accepted", item);
                }}
                disabled={disabledAll}
                aria-disabled={disabledAll}
                className={`px-4 py-2 rounded-md text-white ${
                  disabledAll ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Accept
              </button>

              <button
                onClick={() => {
                  if (disabledAll) return;
                  setNoteMode(true);
                }}
                disabled={disabledAll}
                aria-disabled={disabledAll}
                className={`px-4 py-2 rounded-md text-white ${
                  disabledAll ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                Request changes
              </button>

              <button
                onClick={() => {
                  if (disabledAll) return;
                  onAction("rejected", item);
                }}
                disabled={disabledAll}
                aria-disabled={disabledAll}
                className={`px-4 py-2 rounded-md text-white ${
                  disabledAll ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* overlay */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}