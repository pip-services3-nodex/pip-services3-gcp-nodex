"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyCommandableGoogleFunctionService = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const CommandableGoogleFunctionService_1 = require("../../src/services/CommandableGoogleFunctionService");
class DummyCommandableGoogleFunctionService extends CommandableGoogleFunctionService_1.CommandableGoogleFunctionService {
    constructor() {
        super("dummies");
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
    }
}
exports.DummyCommandableGoogleFunctionService = DummyCommandableGoogleFunctionService;
//# sourceMappingURL=DummyCommandableGoogleFunctionService.js.map