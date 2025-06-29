"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controller/adminController");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const adminRouter = express_1.default.Router();
// Route to create a new user
adminRouter.post('/create-user', (0, catchAsync_1.default)(adminController_1.createUser));
exports.default = adminRouter;
//# sourceMappingURL=adminRoutes.js.map