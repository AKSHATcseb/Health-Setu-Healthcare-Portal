import { useNavigate } from "react-router-dom";

export default function RoleSelector({ role, setRole }) {
  const navigate = useNavigate();

  const handleSelect = (selectedRole) => {
    setRole(selectedRole);

    // persist role for registration flow
    localStorage.setItem("selectedRole", selectedRole);

    // redirect to register page
    navigate("/register");
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {["patient", "hospital_admin"].map((r) => (
        <button
          key={r}
          onClick={() => handleSelect(r)}
          className={`
            py-3 rounded-xl font-semibold capitalize
            transition-all
            ${
              role === r
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }
          `}
        >
          {r === "patient" ? "patient" : "hospital_admin"}
        </button>
      ))}
    </div>
  );
}
