"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
(0, app_1.default)().then((app) => {
    let port;
    if (process.env.NODE_ENV !== "production") {
        port = process.env.PORT;
    }
    else {
        port = process.env.HTTPS_PORT;
    }
    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
});
//# sourceMappingURL=server.js.map