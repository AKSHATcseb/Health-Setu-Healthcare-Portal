import React from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * Props:
 * - data: array of hospital request objects
 * - onRowClick(item)
 * - onActionClick(action, item)   // action: "accepted" | "rejected" | "changes_requested"
 * - actionsDisabled: boolean (when true, disable all action buttons globally)
 */
export default function HospitalTable({
  data = [],
  onRowClick = () => {},
  onActionClick = () => {},
  actionsDisabled = false,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Address</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Reg. No.</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => {
            const isPending = (item.status || "pending") === "pending";
            const disabledAll = actionsDisabled || !isPending;

            return (
              <tr key={item._id} className="hover:bg-gray-50">
                <td
                  className={`px-4 py-3 cursor-pointer ${actionsDisabled ? "opacity-90" : ""}`}
                  onClick={() => onRowClick(item)}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {item.hospitalName}
                    <ArrowUpRight size={16} className="inline-block ml-1 text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-500">{item.phone}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.email}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.address || "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.registrationNumber || "-"}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : item.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : item.status === "changes_requested"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.status || "pending"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => {
                      if (disabledAll) return;
                      onActionClick("accepted", item);
                    }}
                    disabled={disabledAll}
                    aria-disabled={disabledAll}
                    className={`inline-flex items-center px-3 py-1.5 text-sm rounded-md text-white focus:outline-none
                      ${
                        disabledAll
                          ? "bg-green-300 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => {
                      if (disabledAll) return;
                      onActionClick("changes_requested", item);
                    }}
                    disabled={disabledAll}
                    aria-disabled={disabledAll}
                    className={`inline-flex items-center px-3 py-1.5 text-sm rounded-md text-white focus:outline-none
                      ${
                        disabledAll
                          ? "bg-indigo-300 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                  >
                    Request changes
                  </button>

                  <button
                    onClick={() => {
                      if (disabledAll) return;
                      onActionClick("rejected", item);
                    }}
                    disabled={disabledAll}
                    aria-disabled={disabledAll}
                    className={`inline-flex items-center px-3 py-1.5 text-sm rounded-md text-white focus:outline-none
                      ${
                        disabledAll
                          ? "bg-red-300 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}