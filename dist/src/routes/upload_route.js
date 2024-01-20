"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const upload_controller_1 = __importDefault(require("../controller/upload_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
router.post('/userPhoto/:id', auth_middleware_1.default, upload_controller_1.default.uploadUserPhoto);
router.post('/postPhoto/:postId', auth_middleware_1.default, upload_controller_1.default.uploadPostPhoto);
module.exports = router;
//# sourceMappingURL=upload_route.js.map