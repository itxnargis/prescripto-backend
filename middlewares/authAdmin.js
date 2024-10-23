// authAdmin.js
import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
    try {
        const token = req.headers.atoken; // Use 'atoken' consistently
        if (!token) {
            return res.status(403).json({ success: false, message: "Not Authorized. Login Again" });
        }
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // You can add additional checks if needed, e.g., checking user role
        req.user = decoded; // Optional: store decoded user info in request
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ success: false, message: error.message });
    }
}

export default authAdmin;
