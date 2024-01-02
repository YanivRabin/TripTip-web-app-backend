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
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const student_model_1 = __importDefault(require("../model/student_model"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("jest before all");
    yield student_model_1.default.deleteMany();
}));
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
describe("-- Test Student Module --", () => {
    test("test get students - empty array", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/student');
        expect(res.statusCode).toEqual(200);
        const data = res.body;
        expect(data.length).toEqual(0);
    }));
    test("test add new student", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post('/student').send({
            name: "yaniv"
        });
        expect(res.statusCode).toEqual(201);
    }));
    test("test add new student fail - duplicat name", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post('/student').send({
            name: "yaniv"
        });
        expect(res.statusCode).toEqual(500);
    }));
    test("test update student name", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put('/student').send({
            name: "yaniv",
            new_name: "Yaniv"
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual("Yaniv");
    }));
    test("test delete student", () => __awaiter(void 0, void 0, void 0, function* () {
        let res = yield (0, supertest_1.default)(app).delete('/student').send({
            name: "Yaniv"
        });
        expect(res.statusCode).toEqual(200);
        res = yield (0, supertest_1.default)(app).get('/student');
        expect(res.statusCode).toEqual(200);
        const data = res.body;
        expect(data.length).toEqual(0);
    }));
});
//# sourceMappingURL=students.test.js.map