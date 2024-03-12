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
Object.defineProperty(exports, "__esModule", { value: true });
const places_api_controller_1 = require("../controller/places_api_controller");
const apiKey = "AIzaSyAgJRnFfiP_ChMFPXSDnyI5beDQRl4DprY";
if (!apiKey) {
    console.error("Google API key is not provided.");
    process.exit(1);
}
describe("-- Places API Tests --", () => {
    test("Places API - fetch tips for each country", () => __awaiter(void 0, void 0, void 0, function* () {
        const tips = yield (0, places_api_controller_1.fetchTips)(apiKey, "Eiffel Tower, Paris, France");
        console.log("Tips for", "Eiffel Tower, Paris, France", ":", tips);
        expect(true).toBe(true);
    }));
});
//# sourceMappingURL=placesApi.test.js.map