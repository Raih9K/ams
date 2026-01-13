"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const db_1 = __importDefault(require("../config/db"));
const authorize = (permissionName) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.profile) {
                return res.status(403).json({ message: 'Forbidden: No active profile' });
            }
            // Check if the permission exists for the current profile
            const permission = await db_1.default.permission.findFirst({
                where: {
                    name: permissionName,
                    profiles: {
                        some: { id: req.profile.id }
                    }
                }
            });
            if (!permission) {
                return res.status(403).json({ message: `Permission denied: ${permissionName}` });
            }
            // Check for time-based validity
            if (permission.scope === 'TIME_BASED') {
                const now = new Date();
                if (permission.startDate && now < new Date(permission.startDate)) {
                    return res.status(403).json({ message: 'Permission not yet active' });
                }
                if (permission.endDate && now > new Date(permission.endDate)) {
                    return res.status(403).json({ message: 'Permission expired' });
                }
            }
            next();
        }
        catch (error) {
            console.error('Authorization error:', error);
            return res.status(500).json({ message: 'Internal server error during authorization' });
        }
    };
};
exports.authorize = authorize;
