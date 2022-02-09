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
const DummyGoogleFunctionFixture_1 = require("./DummyGoogleFunctionFixture");
suite('DummyCommandableGoogleFunction', () => {
    let fixture;
    suiteSetup(() => __awaiter(void 0, void 0, void 0, function* () {
        fixture = new DummyGoogleFunctionFixture_1.DummyGoogleFunctionFixture('commandableHandler', 3003);
        yield fixture.startCloudServiceLocally();
    }));
    suiteTeardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield fixture.stopCloudServiceLocally();
    }));
    test('CRUD Operations', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fixture.testCrudOperations();
    }));
});
//# sourceMappingURL=DummyCommandableGoogleFunction.test.js.map