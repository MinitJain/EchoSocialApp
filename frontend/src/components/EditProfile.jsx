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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <IoMdClose size={20} />
            </button>
            <h2 className="text-xl font-bold">Edit Profile</h2>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded-full font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Image Preview Section */}
          <div className="mb-8">
            {/* Banner Preview */}
            <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden mb-4">
              {formData.bannerUrl ? (
                <img
                  src={formData.bannerUrl}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Banner Image</span>
                </div>
              )}
            </div>

            {/* Profile Picture Preview */}
            <div className="flex items-end gap-4 -mt-16 ml-6">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                {formData.profileImageUrl ? (
                  <img
                    src={formData.profileImageUrl}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Profile Photo</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Image URL Inputs Section */}
          <div className="space-y-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Profile Images
              </h3>

              {/* Banner URL */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  value={formData.bannerUrl}
                  onChange={(e) =>
                    handleImageUrlChange("bannerUrl", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                  placeholder="https://example.com/banner.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Use landscape images for best results
                </p>
              </div>

              {/* Profile Picture URL */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  value={formData.profileImageUrl}
                  onChange={(e) =>
                    handleImageUrlChange("profileImageUrl", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                  placeholder="https://example.com/photo.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Use square images (1:1 ratio) for best results
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-700">
              Profile Information
            </h3>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                maxLength={160}
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${
                  errors.bio ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Tell us about yourself..."
              />
              <div className="flex justify-between items-center mt-2">
                {errors.bio && (
                  <p className="text-red-500 text-sm">{errors.bio}</p>
                )}
                <p className="text-gray-500 text-sm ml-auto">
                  {formData.bio.length}/160
                </p>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              💡 Image Tips
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>
                • Use <strong>Unsplash</strong> or <strong>Pexels</strong> for
                free high-quality images
              </li>
              <li>
                • Upload to <strong>Imgur</strong> and copy the direct image
                link
              </li>
              <li>• Make sure the image URL ends with .jpg, .png, or .gif</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
