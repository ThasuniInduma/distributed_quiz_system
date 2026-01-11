import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please login again"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set both req.user and req.body.userId for backward compatibility
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

export default userAuth;
