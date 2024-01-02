"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_controller_1 = __importDefault(require("../controller/auth_controller"));
// router.post('/register', AuthController.register);
router.post('/login', auth_controller_1.default.login);
module.exports = router;
//# sourceMappingURL=auth_route.js.map