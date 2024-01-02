"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const student_controller_1 = __importDefault(require("../controller/student_controller"));
router.get('/', student_controller_1.default.getStudent);
// router.post('/', Student.addStudent)
router.put('/', student_controller_1.default.updateStudent);
router.delete('/', student_controller_1.default.deleteStudent);
module.exports = router;
//# sourceMappingURL=student_route.js.map