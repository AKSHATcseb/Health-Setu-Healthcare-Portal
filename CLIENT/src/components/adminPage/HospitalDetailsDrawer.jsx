import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function HospitalDetailsDrawer({
  open,
  item,
  onClose = () => {},
  onAction = () => {},
  actionsDisabled = false,
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <h3 className="text-sm font-semibold text-slate-600 mb-3">{title}</h3>
      <div className="text-sm text-slate-800 space-y-2">{children}</div>
    </div>
  );

  const renderSlots = (slots = []) =>
    slots.length ? (
      slots.map((s, i) => (
        <span
          key={i}
          className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md mr-2 mb-2 inline-block"
        >
          {s.start} - {s.end}
        </span>
      ))
    ) : (
      <span className="text-slate-400 text-xs">No slots</span>
    );

  return (
    <div className="fixed inset-0 z-50 flex">

      {/* DRAWER */}
      <div className="w-full sm:max-w-2xl lg:max-w-3xl ml-auto bg-slate-50 h-full overflow-auto shadow-2xl">

        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-white border-b px-4 sm:px-6 py-4 flex justify-between items-start">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
              {item.hospitalName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">{item.email}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-slate-100 transition"
          >
            <X size={18} className="text-slate-600" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 sm:p-6 space-y-4">

          {/* BASIC */}
          <Section title="Basic Information">
            <div><span className="font-medium">Registration:</span> {item.registrationNumber}</div>
            <div><span className="font-medium">Phone:</span> {item.phone}</div>
            <div>
              <span className="font-medium">Status:</span>{" "}
              <span className="px-2 py-1 text-xs rounded bg-slate-200">
                {item.status}
              </span>
            </div>
          </Section>

          {/* LOCATION */}
          <Section title="Location">
            <div>{item.address || "-"}</div>
          </Section>

          {/* DIALYSIS */}
          <Section title="Dialysis Details">
            <div><span className="font-medium">Type:</span> {item.dialysisType}</div>
            <div><span className="font-medium">Seats:</span> {item.dialysisSeats}</div>
          </Section>

          {/* PRICING */}
          <Section title="Pricing">
            <div>4 Hr: ₹ {item.priceFor4Hrs ?? "-"}</div>
            <div>6 Hr: ₹ {item.priceFor6Hrs ?? "-"}</div>
            <div>Peritoneal: ₹ {item.priceForPD ?? "-"}</div>
          </Section>

          {/* OPERATING */}
          <Section title="Operating Days">
            {item.is24x7 ? (
              <div className="text-green-600 font-medium">24x7 Open</div>
            ) : (
              Object.entries(item.operatingHours || {}).map(([day, val]) => (
                <div key={day} className="flex justify-between">
                  <span className="capitalize">{day}</span>
                  <span className={val?.closed ? "text-red-500" : "text-green-600"}>
                    {val?.closed ? "Closed" : "Open"}
                  </span>
                </div>
              ))
            )}
          </Section>

          {/* SLOTS */}
          <Section title="Dialysis Slots">
            <div>
              <p className="font-medium mb-1">4 Hour Slots</p>
              {renderSlots(item?.slots?.slots4h)}
            </div>

            <div className="mt-2">
              <p className="font-medium mb-1">6 Hour Slots</p>
              {renderSlots(item?.slots?.slots6h)}
            </div>
          </Section>

          {/* BANK */}
          <Section title="Bank Details">
            <div>Account Holder: {item.accountHolderName || "-"}</div>
            <div>UPI ID: {item.upiID || "-"}</div>
          </Section>

          {/* DOCUMENTS */}
          {item.documents?.length > 0 && (
            <Section title="Documents">
              {item.documents.map((d, i) => (
                <a
                  key={i}
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  {d.name || d.url}
                </a>
              ))}
            </Section>
          )}
        </div>
      </div>

      {/* OVERLAY */}
      <div
        className="flex-1 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
    </div>
  );
}