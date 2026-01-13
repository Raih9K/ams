"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const audit_1 = require("./middleware/audit");
const auth_1 = require("./middleware/auth");
const authorize_1 = require("./middleware/authorize");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Boot message
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Academy Management System (AMS) API' });
});
// Example route using middleware
app.get('/api/protected', auth_1.authenticate, (0, authorize_1.authorize)('system:access'), (0, audit_1.auditLog)('ACCESS'), (req, res) => {
    res.json({
        message: 'Authorized access granted',
        user: req.user,
        profile: req.profile
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
