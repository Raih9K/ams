"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLog = void 0;
const db_1 = __importDefault(require("../config/db"));
const auditLog = (action) => {
    return async (req, res, next) => {
        // We capture the response finish event to log the outcome
        res.on('finish', async () => {
            try {
                if (req.user) {
                    await db_1.default.auditLog.create({
                        data: {
                            action: action,
                            entity: req.path,
                            performedById: req.user.id,
                            details: {
                                method: req.method,
                                statusCode: res.statusCode,
                                ip: req.ip,
                                userAgent: req.get('user-agent'),
                                params: req.params,
                                query: req.query
                            }
                        }
                    });
                }
            }
            catch (error) {
                console.error('Audit log error:', error);
            }
        });
        next();
    };
};
exports.auditLog = auditLog;
