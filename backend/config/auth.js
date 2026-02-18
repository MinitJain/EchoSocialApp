import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      console.log("No token found in cookies");
      return res.status(401).json({
        message: "Unauthorized access",
        success: false,
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    console.error("JWT Verification Failed:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};
``;
export default isAuthenticated;
