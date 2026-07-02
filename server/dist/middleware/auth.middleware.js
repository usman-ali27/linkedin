import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
export const protect = (req, res, next) => {
    try {
        const tokenFromHeader = req.headers.authorization?.split(" ")[1];
        const tokenFromCookie = req.cookies?.accessToken;
        const token = tokenFromHeader || tokenFromCookie;
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
