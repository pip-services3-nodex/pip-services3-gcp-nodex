"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyCommandableCloudFunctionService = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const CommandableCloudFunctionService_1 = require("../../src/services/CommandableCloudFunctionService");
class DummyCommandableCloudFunctionService extends CommandableCloudFunctionService_1.CommandableCloudFunctionService {
    constructor() {
        super("dummies");
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
    }
}
exports.DummyCommandableCloudFunctionService = DummyCommandableCloudFunctionService;
//# sourceMappingURL=DummyCommandableCloudFunctionService.js.map