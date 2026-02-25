import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Cpu,
  IndianRupee,
  CalendarCheck,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    path: "/center/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "Update Details",
    path: "/center/update",
    icon: <Cpu size={18} />,
  },
  // {
  //   label: "Bookings",
  //   path: "/bookings",
  //   icon: <CalendarCheck size={18} />,
  // },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col justify-between">
      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="px-6 py-5 border-b">
          <h1 className="text-2xl font-bold text-teal-600">
            HealthSetu
          </h1>
          <p className="text-xs text-slate-500">
            Dialysis Center Panel
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path;

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center gap-3
                  px-4 py-2.5 rounded-xl text-sm font-medium
                  transition-all
                  ${
                    isActive
                      ? "bg-teal-50 text-teal-700 border-l-4 border-teal-600"
                      : "text-slate-600 hover:bg-slate-100"
                  }
                `}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="px-6 py-5 border-t">
        <button
          onClick={() => navigate("/login")}
          className="
            flex items-center gap-2 text-sm
            text-red-500 hover:text-red-600
            transition
          "
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
