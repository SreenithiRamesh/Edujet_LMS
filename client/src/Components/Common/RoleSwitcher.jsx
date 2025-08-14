import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const RoleSwitcher = () => {
  const { user, isSignedIn } = useUser();
  const [role, setRole] = useState("student");

  useEffect(() => {
    if (user?.publicMetadata?.role) {
      setRole(user.publicMetadata.role);
    }
  }, [user]);

  const switchRole = async () => {
    const newRole = role === "student" ? "educator" : "student";
    try {
      await axios.post("/api/user/switch-role", { role: newRole });
      toast.success(`Switched to ${newRole} role`);
      window.location.reload();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Failed to switch role");
    }
  };

  return (
    isSignedIn && (
      <button
        onClick={switchRole}
        className="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs"
      >
        Switch to {role === "student" ? "Educator" : "Student"}
      </button>
    )
  );
};

export default RoleSwitcher;
