"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controller/paymentController");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const router = express_1.default.Router();
// User routes
router.post('/create', (0, catchAsync_1.default)(paymentController_1.createPayment));
router.get('/user', (0, catchAsync_1.default)(paymentController_1.getUserPayments));
// Admin routes
router.post('/verify', (0, catchAsync_1.default)(paymentController_1.verifyPayment));
router.get('/all', (0, catchAsync_1.default)(paymentController_1.getAllPayments));
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map