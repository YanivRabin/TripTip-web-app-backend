"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_controller_1 = __importDefault(require("../controller/auth_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
router.post('/register', auth_controller_1.default.register);
router.post('/login', auth_controller_1.default.login);
router.get('/logout', auth_middleware_1.default, auth_controller_1.default.logout);
router.get('/refreshToken', auth_controller_1.default.refreshToken);
module.exports = router;
//# sourceMappingURL=auth_route.js.map