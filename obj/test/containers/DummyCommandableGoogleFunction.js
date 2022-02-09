"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyCommandableGoogleFunction = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const CommandableGoogleFunction_1 = require("../../src/containers/CommandableGoogleFunction");
const DummyFactory_1 = require("../DummyFactory");
class DummyCommandableGoogleFunction extends CommandableGoogleFunction_1.CommandableGoogleFunction {
    constructor() {
        super("dummy", "Dummy lambda function");
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
        this._factories.add(new DummyFactory_1.DummyFactory());
    }
}
exports.DummyCommandableGoogleFunction = DummyCommandableGoogleFunction;
//# sourceMappingURL=DummyCommandableGoogleFunction.js.map