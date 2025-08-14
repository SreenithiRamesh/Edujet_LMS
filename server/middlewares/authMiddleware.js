import { clerkClient } from "@clerk/express";


export const requireSignIn = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      return res.status(403).json({ success: false, message: "User not found" });
    }

    req.user = user;
    req.auth = { userId: user.id }; 
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(403).json({ success: false, message: "Invalid session" });
  }
};


export const protectEducator = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;
    const response = await clerkClient.users.getUser(userId);

    if (response.publicMetadata.role !== "educator") {
      return res.json({ success: false, message: "Unauthorized Access" });
    }

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


