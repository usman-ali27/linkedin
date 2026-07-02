import crypto from "crypto";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL_DAYS = 7;
const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
};
const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    });
};
const clearAuthCookies = (res) => {
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
};
const createAccessToken = (user) => jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
});
const createRefreshTokenRecord = async (userId) => {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = await bcrypt.hash(token, 10);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
        data: {
            userId,
            tokenHash,
            expiresAt,
        },
    });
    return { token, expiresAt };
};
const revokeUserRefreshTokens = async (userId) => {
    await prisma.refreshToken.updateMany({
        where: {
            userId,
            revokedAt: null,
        },
        data: {
            revokedAt: new Date(),
        },
    });
};
const issueTokens = async (res, user) => {
    await revokeUserRefreshTokens(user.id);
    const accessToken = createAccessToken(user);
    const refreshToken = await createRefreshTokenRecord(user.id);
    setAuthCookies(res, accessToken, refreshToken.token);
    return { accessToken, refreshToken };
};
const buildUserPayload = (user) => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
});
export const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "User already exists", success: false });
        }
        const hashPassword = await bcrypt.hash(password, 8);
        const user = await prisma.user.create({
            data: { fullName, email, password: hashPassword },
        });
        await issueTokens(res, user);
        res.status(201).json({
            message: "User registered successfully",
            user: buildUserPayload(user),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res
                .status(400)
                .json({ message: "Email is not exist", success: false });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res
                .status(400)
                .json({ message: "Password is wrong", success: false });
        }
        await issueTokens(res, user);
        res.json({
            message: "Login successful",
            user: buildUserPayload(user),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
export const me = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        res.json({
            user: buildUserPayload({
                id: user.userId,
                fullName: user.email,
                email: user.email,
                role: user.role,
            }),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
export const refresh = async (req, res) => {
    try {
        const refreshTokenValue = req.cookies?.refreshToken;
        if (!refreshTokenValue) {
            clearAuthCookies(res);
            return res.status(401).json({ message: "No refresh token provided" });
        }
        const activeTokens = await prisma.refreshToken.findMany({
            where: {
                expiresAt: { gt: new Date() },
                revokedAt: null,
            },
            orderBy: { createdAt: "desc" },
        });
        let matchingToken = null;
        for (const tokenRecord of activeTokens) {
            const isValid = await bcrypt.compare(refreshTokenValue, tokenRecord.tokenHash);
            if (isValid) {
                matchingToken = tokenRecord;
                break;
            }
        }
        if (!matchingToken) {
            clearAuthCookies(res);
            return res
                .status(401)
                .json({ message: "Invalid or expired refresh token" });
        }
        const user = await prisma.user.findUnique({
            where: { id: matchingToken.userId },
        });
        if (!user) {
            clearAuthCookies(res);
            return res.status(401).json({ message: "User not found" });
        }
        await prisma.refreshToken.update({
            where: { id: matchingToken.id },
            data: { revokedAt: new Date() },
        });
        await issueTokens(res, user);
        res.json({
            message: "Token refreshed",
            user: buildUserPayload(user),
        });
    }
    catch (error) {
        console.error(error);
        clearAuthCookies(res);
        res.status(500).json({ message: "Server error" });
    }
};
export const logout = async (req, res) => {
    try {
        const refreshTokenValue = req.cookies?.refreshToken;
        if (refreshTokenValue) {
            const activeTokens = await prisma.refreshToken.findMany({
                where: {
                    expiresAt: { gt: new Date() },
                    revokedAt: null,
                },
            });
            for (const tokenRecord of activeTokens) {
                const isValid = await bcrypt.compare(refreshTokenValue, tokenRecord.tokenHash);
                if (isValid) {
                    await prisma.refreshToken.update({
                        where: { id: tokenRecord.id },
                        data: { revokedAt: new Date() },
                    });
                    break;
                }
            }
        }
        clearAuthCookies(res);
        res.json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.error(error);
        clearAuthCookies(res);
        res.status(500).json({ message: "Server error" });
    }
};
