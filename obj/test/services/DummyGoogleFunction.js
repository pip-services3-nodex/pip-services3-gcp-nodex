"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.DummyGoogleFunction = void 0;
const GoogleFunction_1 = require("../../src/containers/GoogleFunction");
const DummyFactory_1 = require("../DummyFactory");
class DummyGoogleFunction extends GoogleFunction_1.GoogleFunction {
    constructor() {
        super("dummy", "Dummy lambda function");
        this._factories.add(new DummyFactory_1.DummyFactory());
    }
}
exports.DummyGoogleFunction = DummyGoogleFunction;
exports.handler = new DummyGoogleFunction().getHandler();
//# sourceMappingURL=DummyGoogleFunction.js.map