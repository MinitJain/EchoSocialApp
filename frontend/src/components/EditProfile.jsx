import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import toast from "react-hot-toast";
import { USER_API_END_POINT } from "../utils/constant";
import { updateUser } from "../redux/userSlice";

const EditProfile = ({ isOpen, onClose }) => {
  const { user, profile } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    profileImageUrl: "",
    bannerUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Pre-fill form with current user data
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        username: profile.username || "",
        bio: profile.bio || "",
        profileImageUrl: profile.profileImageUrl || "",
        bannerUrl: profile.bannerUrl || "",
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name cannot be empty";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username cannot be empty";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    if (formData.bio && formData.bio.length > 160) {
      newErrors.bio = "Bio cannot exceed 160 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `${USER_API_END_POINT}/update/${user._id}`,
        formData,
        { withCredentials: true },
      );

      if (response.data.success) {
        // Update Redux store
        dispatch(updateUser(response.data.user));

        // Update localStorage
        const updatedUser = { ...user, ...response.data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        toast.success("Profile updated successfully!");
        onClose();
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);

      // Set specific field errors if available
      if (error.response?.data?.field) {
        setErrors({ [error.response.data.field]: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUrlChange = (type, url) => {
    setFormData((prev) => ({
      ...prev,
      [type]: url,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 p-4">
      <div className="w-full max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="rounded-full p-2 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
            >
              <IoMdClose size={20} />
            </button>

            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Edit Profile
            </h2>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-full bg-blue-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-400 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Banner + Avatar Wrapper */}
          <div className="relative mb-16">
            {/* Banner Preview */}
            <div className="h-40 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-sm dark:shadow-none">
              {formData.bannerUrl ? (
                <img
                  src={formData.bannerUrl}
                  alt="Banner preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-xs text-zinc-500">Banner Image</span>
                </div>
              )}
            </div>

            {/* Avatar Preview */}
            <div className="absolute -bottom-12 left-6 z-10">
              <div
                className="
      h-24 w-24 rounded-full overflow-hidden
      border-4 border-white dark:border-zinc-950
      bg-zinc-200 dark:bg-zinc-900
      shadow-md dark:shadow-black/40
      ring-1 ring-black/5 dark:ring-white/10
    "
              >
                {formData.profileImageUrl ? (
                  <img
                    src={formData.profileImageUrl}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-xs text-zinc-500">Profile</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-5">
            {/* Banner URL */}
            <input
              type="url"
              value={formData.bannerUrl}
              onChange={(e) =>
                handleImageUrlChange("bannerUrl", e.target.value)
              }
              placeholder="Banner image URL"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />

            {/* Profile URL */}
            <input
              type="url"
              value={formData.profileImageUrl}
              onChange={(e) =>
                handleImageUrlChange("profileImageUrl", e.target.value)
              }
              placeholder="Profile image URL"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />

            {/* Name */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />

            {/* Username */}
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />

            {/* Bio */}
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              placeholder="Tell us about yourself..."
              className="w-full resize-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
