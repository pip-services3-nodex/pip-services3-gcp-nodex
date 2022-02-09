"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandableHandler = exports.DummyCommandableGoogleFunction = void 0;
const CommandableGoogleFunction_1 = require("../../src/containers/CommandableGoogleFunction");
const DummyFactory_1 = require("../DummyFactory");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
class DummyCommandableGoogleFunction extends CommandableGoogleFunction_1.CommandableGoogleFunction {
    constructor() {
        super("dummy", "Dummy commandable lambda function");
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
        this._factories.add(new DummyFactory_1.DummyFactory());
    }
}
exports.DummyCommandableGoogleFunction = DummyCommandableGoogleFunction;
exports.commandableHandler = new DummyCommandableGoogleFunction().getHandler();
//# sourceMappingURL=DummyCommandableGoogleFunction.js.map