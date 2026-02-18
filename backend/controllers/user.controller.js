import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweet.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      console.log("Missing Fields:", name, username, email, password);
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({
        message: "Email already in use.",
        success: false,
      });
    }

    const existingUsername = await User.findOne({ username }).lean();
    if (existingUsername) {
      return res.status(400).json({
        message: "Username already in use.",
        success: false,
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const token = await jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    const user = { ...userWithoutPassword, id: newUser._id.toString() };

    // Set cookie and return user
    return res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Account created successfully.",
        success: true,
        user,
      });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email }).lean();
    if (!existingUser) {
      return res.status(400).json({
        message: "Invalid email or password.",
        success: false,
      });
    }

    const isPasswordValid = await bcryptjs.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password.",
        success: false,
      });
    }

    const token = await jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const { password: _, ...userWithoutPassword } = existingUser;

    // re-map _id -> id
    const user = {
      ...userWithoutPassword,
      id: existingUser._id.toString(),
    };
    // Send token in cookie with correct expiry
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true for HTTPS in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // none for cross-origin, lax for local
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({
        message: `Welcome back! ${user.name}`,
        success: true,
        user,
      });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  // Clear the token cookie
  return res
    .cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: new Date(0), // Expire it immediately
    })
    .status(200)
    .json({
      message: "Logged out successfully",
      success: true,
    });
};

export const bookmark = async (req, res) => {
  try {
    const LoggedInUserId = req.user;

    const tweetId = req.params.id;

    const foundUser = await User.findById(LoggedInUserId);

    // If user doesn't exist
    if (!foundUser) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // If tweet is already bookmarked, remove it
    if (foundUser.bookmarks.includes(tweetId)) {
      await User.findByIdAndUpdate(LoggedInUserId, {
        $pull: { bookmarks: tweetId },
      });

      return res.status(200).json({
        message: "Bookmark removed successfully.",
        success: true,
      });
    } else {
      // If tweet is not bookmarked, add it
      await User.findByIdAndUpdate(LoggedInUserId, {
        $push: { bookmarks: tweetId },
      });

      return res.status(200).json({
        message: "Bookmark added successfully.",
        success: true,
      });
    }
  } catch (error) {
    console.log("Bookmark Error:", error);
    return res.status(500).json({
      message: "Error in saving bookmarks.",
      success: false,
    });
  }
};

export const GetUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password").lean();
    return res.status(200).json({
      message: "User profile fetched successfully.",
      success: true,
      user,
    });
  } catch (error) {
    console.log("GetUserProfile Error:", error);
    return res.status(500).json({
      message: "Error fetching user profile.",
      success: false,
    });
  }
};
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("getMe Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getOtherUserProfile = async (req, res) => {
  try {
    const loggedInUserId = req.user;

    const otherUsers = await User.find({
      _id: { $ne: loggedInUserId },
      followers: { $nin: [loggedInUserId] },
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      otherUsers,
    });
  } catch (error) {
    console.log("Suggestion Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching suggestions",
    });
  }
};

export const follow = async (req, res) => {
  try {
    const LoggedInUserId = req.user;
    const userIdToFollow = req.params.id;

    const loggedInUser = await User.findById(LoggedInUserId);
    const userToFollow = await User.findById(userIdToFollow);

    if (!loggedInUser || !userToFollow) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Check if already following
    if (userToFollow.followers.includes(LoggedInUserId)) {
      return res.status(400).json({
        message: "You are already following this user.",
        success: false,
      });
    }

    // Push follower/following
    await userToFollow.updateOne({ $push: { followers: LoggedInUserId } });
    await loggedInUser.updateOne({ $push: { following: userIdToFollow } });

    return res.status(200).json({
      message: `${loggedInUser.name} has followed ${userToFollow.name}`,
      success: true,
    });
  } catch (error) {
    console.log("Follow Error:", error);
    return res.status(500).json({
      message: "Error following user.",
      success: false,
    });
  }
};

export const unfollow = async (req, res) => {
  try {
    const LoggedInUserId = req.user;
    const userIdToFollow = req.params.id;

    const loggedInUser = await User.findById(LoggedInUserId);
    const userToUnfollow = await User.findById(userIdToFollow);

    if (!loggedInUser || !userToUnfollow) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Check if already following
    if (!loggedInUser.following.includes(userIdToFollow)) {
      return res.status(400).json({
        message: "You have alerady unfollowed this user.",
        success: false,
      });
    }

    await userToUnfollow.updateOne({ $pull: { followers: LoggedInUserId } });
    await loggedInUser.updateOne({ $pull: { following: userIdToFollow } });

    return res.status(200).json({
      message: `${loggedInUser.name} has unfollowed ${userToUnfollow.name}`,
      success: true,
    });
  } catch (error) {
    console.log("UnFollow Error:", error);
    return res.status(500).json({
      message: "Error unfollowing user.",
      success: false,
    });
  }
};

// Update Profile Controller
export const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, username, bio, profileImageUrl, bannerUrl } = req.body;
    const loggedInUserId = req.user; // req.user is already the user ID from auth middleware

    // Check if user is trying to update their own profile
    if (userId !== loggedInUserId) {
      return res.status(403).json({
        message: "You can only update your own profile.",
        success: false,
      });
    }

    // Validation
    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Name cannot be empty.",
        success: false,
      });
    }

    if (!username || username.trim() === "") {
      return res.status(400).json({
        message: "Username cannot be empty.",
        success: false,
      });
    }

    // Check username format (alphanumeric and underscores only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message: "Username can only contain letters, numbers, and underscores.",
        success: false,
      });
    }

    // Check bio length
    if (bio && bio.length > 160) {
      return res.status(400).json({
        message: "Bio cannot exceed 160 characters.",
        success: false,
      });
    }

    // Check if username is already taken by another user
    const existingUser = await User.findOne({
      username: username,
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username is already taken.",
        success: false,
      });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name.trim(),
        username: username.trim(),
        bio: bio ? bio.trim() : "",
        profileImageUrl: profileImageUrl || "",
        bannerUrl: bannerUrl || "",
      },
      { new: true, select: "-password" },
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log("Update Profile Error:", error);
    return res.status(500).json({
      message: "Error updating profile.",
      success: false,
    });
  }
};
