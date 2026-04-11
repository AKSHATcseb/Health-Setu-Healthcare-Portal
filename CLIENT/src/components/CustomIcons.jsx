import React from "react";

// /**
//  * Each icon accepts:
//  * - size (number) — optional, default 24
//  * - className (string) — optional, for tailwind classes (w-6 h-6 etc)
//  * - title (string) — optional for accessibility
//  *
//  * They use currentColor so you can control color with text-*/text-*-* classes or style={{ color: ... }}
//  */

export function HeartPulseBadge({ size = 24, className = "", title }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden={title ? "false" : "true"}
      role={title ? "img" : "presentation"}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M12 20s-6-3.5-8.5-6C1 10 5 5 9 7c1 .6 2 .6 3 0 4-2 8 3 5.5 7-2.5 4-7 12-7 12z"
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d="M5 12.5L8 12l1-2 1.5 4L13 9l1.5 3h2"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MonitorWave({ size = 24, className = "", title }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden={title ? "false" : "true"}
      role={title ? "img" : "presentation"}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <rect x="2" y="4" width="20" height="12" rx="2" fill="currentColor" opacity="0.95" />
      <path d="M3 18h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 11l2-3 2 6 2-4 2 2 2-1" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SeniorAvatar({ size = 24, className = "", title }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden={title ? "false" : "true"}
      role={title ? "img" : "presentation"}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <circle cx="12" cy="8" r="3.2" fill="currentColor" opacity="0.98" />
      <path d="M4 20c1.5-3 5-5 8-5s6.5 2 8 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 8c-.6 1.2-1 2-2.5 2" stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ClinicianBadge({ size = 24, className = "", title }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? "false" : "true"}
      role={title ? "img" : "presentation"}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <rect x="2.5" y="2.5" width="19" height="19" rx="4" fill="currentColor" opacity="0.96" />
      <path d="M8 14s1-3 4-3 4 3 4 3" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7v2" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 11.5l1 1" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShieldLock({ size = 24, className = "", title }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? "false" : "true"}
      role={title ? "img" : "presentation"}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <path d="M12 2l6 3v5c0 5-4 9-6 10-2-1-6-5-6-10V5l6-3z" fill="currentColor" opacity="0.98" />
      <rect x="9" y="10" width="6" height="5" rx="1" fill="#ffffff" />
      <path d="M11 12v-1a1 1 0 112 0v1" stroke="#0b1220" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CalendarCheckIcon({ size = 24, className = "", title }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? "false" : "true"}
      role={title ? "img" : "presentation"}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor" opacity="0.95" />
      <path d="M7 3v3M17 3v3" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HeadphonesSupport({ size = 24, className = "", title }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? "false" : "true"}
      role={title ? "img" : "presentation"}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <path d="M4 13.5V12a8 8 0 0116 0v1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="13.5" width="3.8" height="5" rx="1" fill="currentColor" opacity="0.95" />
      <rect x="17.2" y="13.5" width="3.8" height="5" rx="1" fill="currentColor" opacity="0.95" />
    </svg>
  );
}

export function ChartArea({ size = 24, className = "", title }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? "false" : "true"}
      role={title ? "img" : "presentation"}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <path d="M3 16c3-3 6-5 9-5s6 2 9 5v3H3v-3z" fill="currentColor" opacity="0.96" />
      <path d="M6 14l2-3 3 4 4-5 3 3" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}