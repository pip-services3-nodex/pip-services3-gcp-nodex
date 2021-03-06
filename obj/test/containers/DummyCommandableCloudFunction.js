"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyCommandableCloudFunction = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const CommandableCloudFunction_1 = require("../../src/containers/CommandableCloudFunction");
const DummyFactory_1 = require("../DummyFactory");
class DummyCommandableCloudFunction extends CommandableCloudFunction_1.CommandableCloudFunction {
    constructor() {
        super("dummy", "Dummy GCP function");
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
        this._factories.add(new DummyFactory_1.DummyFactory());
    }
}
exports.DummyCommandableCloudFunction = DummyCommandableCloudFunction;
//# sourceMappingURL=DummyCommandableCloudFunction.js.map