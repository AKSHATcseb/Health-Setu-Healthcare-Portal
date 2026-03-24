const BASE = "/admin"; // change if your backend uses a different prefix or full URL

export async function fetchRequests(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") qs.set(k, String(v));
  });
  const res = await fetch(`${BASE}/requests?${qs.toString()}`, {
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("Failed to fetch requests: " + (text || res.status));
  }
  return res.json(); // expected { data: Request[], total }
}

export async function fetchRequestDetails(id) {
  const res = await fetch(`${BASE}/requests/${id}`, { credentials: "include" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("Failed to fetch request: " + (text || res.status));
  }
  return res.json(); // expected Request
}

export async function approveRequest(id, body = {}) {
  const res = await fetch(`${BASE}/requests/${id}/approve`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("Failed to approve: " + (text || res.status));
  }
  return res.json();
}

export async function validateRequest(id, body = {}) {
  const res = await fetch(`${BASE}/requests/${id}/validate`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("Failed to validate: " + (text || res.status));
  }
  return res.json();
}

export async function rejectRequest(id, body = {}) {
  const res = await fetch(`${BASE}/requests/${id}/reject`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("Failed to reject: " + (text || res.status));
  }
  return res.json();
}

export async function requestChanges(id, body = {}) {
  const res = await fetch(`${BASE}/requests/${id}/request-changes`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("Failed to request changes: " + (text || res.status));
  }
  return res.json();
}