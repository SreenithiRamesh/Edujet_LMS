import React, { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

const EducatorOnboarding = () => {
  // eslint-disable-next-line no-unused-vars
  const { user } = useUser();
  const { getToken } = useAuth();

  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    expertise: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.displayName || !form.bio || !form.expertise) {
      toast.error("All fields are required");
      return;
    }

    try {
      const token = await getToken();

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/educator/onboard`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Onboarding completed!");
        window.location.href = "/educator";
      } else {
        toast.error(res.data.message || "Onboarding failed");
      }
    } catch (err) {
      console.error("Onboarding Error:", err);
      toast.error("Failed to onboard. Try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Educator Onboarding</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="displayName"
          placeholder="Display Name"
          value={form.displayName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="expertise"
          placeholder="Expertise"
          value={form.expertise}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EducatorOnboarding;
