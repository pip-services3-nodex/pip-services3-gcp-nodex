"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.DummyCloudFunction = void 0;
const CloudFunction_1 = require("../../src/containers/CloudFunction");
const DummyFactory_1 = require("../DummyFactory");
class DummyCloudFunction extends CloudFunction_1.CloudFunction {
    constructor() {
        super("dummy", "Dummy lambda function");
        this._factories.add(new DummyFactory_1.DummyFactory());
    }
}
exports.DummyCloudFunction = DummyCloudFunction;
exports.handler = new DummyCloudFunction().getHandler();
//# sourceMappingURL=DummyCloudFunction.js.map