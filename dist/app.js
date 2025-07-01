"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const userController_1 = require("./controller/userController");
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = (0, userController_1.setupWebSocket)(httpServer); // Initialize WebSocket
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Middleware to attach io to request
app.use((req, _res, next) => {
    req.io = io;
    next();
});
app.get('/', (req, res) => {
    console.log(req.method);
    res.send('This is the backend server of Nepal Citizen Services, Whatsup visitor!!');
});
// Routes
app.use('/api/users', (0, userRouter_1.default)(io));
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
// Server listen
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map