import React from "react";
import AppointmentCard from "./AppointmentCard";
import EmptyState from "./EmptyState";

export default function AppointmentsList({
  appointments,
  filter,
  onEdit,
  onCancel,
  onView,
}) {
  const filteredAppointments = appointments.filter((apt) => {
    if (filter === "all") return true;
    return apt.status === filter;
  });

  if (filteredAppointments.length === 0) {
    return <EmptyState filter={filter} />;
  }

  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900">
          {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? "s" : ""}
        </h2>
      </div>
      {filteredAppointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onEdit={onEdit}
          onCancel={onCancel}
          onView={onView}
        />
      ))}
    </div>
  );
}