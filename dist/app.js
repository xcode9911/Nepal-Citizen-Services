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
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes")); // Adjust path as necessary
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    console.log(req.method);
    res.send('This is the backend server of Nepal Citizen Services, Whatsup visitor!!');
});
app.use('/api/users', userRouter_1.default);
app.use('/api/admin', adminRoutes_1.default);
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map