import React from "react";

/**
 * Props:
 * - data: array of hospital request objects
 * - onRowClick(item)
 * - onActionClick(action, item)   // action: "accepted" | "rejected" | "changes_requested"
 */
export default function HospitalTable({ data = [], onRowClick = () => {}, onActionClick = () => {} }) {
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
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 cursor-pointer" onClick={() => onRowClick(item)}>
                <div className="text-sm font-medium text-gray-900">{item.hospitalName}</div>
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
                  onClick={() => onActionClick("accepted", item)}
                  className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                >
                  Accept
                </button>

                <button
                  onClick={() => onActionClick("changes_requested", item)}
                  className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                >
                  Request changes
                </button>

                <button
                  onClick={() => onActionClick("rejected", item)}
                  className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}