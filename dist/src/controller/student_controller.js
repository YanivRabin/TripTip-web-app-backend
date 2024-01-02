"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const student_model_1 = __importDefault(require("../model/student_model"));
const getStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("get student");
    try {
        const students = yield student_model_1.default.find();
        console.log(students);
        res.status(200).json(students);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// const addStudent = async (req: Request, res: Response) => {
//     console.log("save student");
//     const student = new Student(req.body);
//     try {
//         await student.save();
//         console.log(student);
//         res.status(201).json(student); // HTTP 201 Created
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Internal Server Error' }); // HTTP 500 Internal Server Error
//     }
// };
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('update student');
    try {
        const student = yield student_model_1.default.findOneAndUpdate({ name: req.body.name }, { name: req.body.new_name }, { new: true });
        if (student) {
            console.log(student);
            res.status(200).json(student); // HTTP 200 OK
        }
        else {
            res.status(404).json({ error: 'Student not found' }); // HTTP 404 Not Found
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' }); // HTTP 500 Internal Server Error
    }
});
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('delete student');
    try {
        const student = yield student_model_1.default.findOneAndDelete(req.body);
        if (student) {
            console.log(student);
            res.status(200).json(student); // HTTP 200 OK
        }
        else {
            res.status(404).json({ error: 'Student not found' }); // HTTP 404 Not Found
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' }); // HTTP 500 Internal Server Error
    }
});
module.exports = {
    getStudent,
    // addStudent,
    updateStudent,
    deleteStudent
};
//# sourceMappingURL=student_controller.js.map