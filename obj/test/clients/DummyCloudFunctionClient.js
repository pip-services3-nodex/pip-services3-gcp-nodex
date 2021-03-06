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
exports.DummyCloudFunctionClient = void 0;
const CloudFunctionClient_1 = require("../../src/clients/CloudFunctionClient");
class DummyCloudFunctionClient extends CloudFunctionClient_1.CloudFunctionClient {
    constructor() {
        super();
    }
    getDummies(correlationId, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.call('dummies.get_dummies', correlationId, {
                filter: filter,
                paging: paging
            });
            return response;
        });
    }
    getDummyById(correlationId, dummyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.call('dummies.get_dummy_by_id', correlationId, {
                dummy_id: dummyId
            });
            if (response == null || Object.keys(response).length === 0) {
                return null;
            }
            return response;
        });
    }
    createDummy(correlationId, dummy) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.call('dummies.create_dummy', correlationId, {
                dummy: dummy
            });
            return response;
        });
    }
    updateDummy(correlationId, dummy) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.call('dummies.update_dummy', correlationId, {
                dummy: dummy
            });
            return response;
        });
    }
    deleteDummy(correlationId, dummyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.call('dummies.delete_dummy', correlationId, {
                dummy_id: dummyId
            });
            return response;
        });
    }
}
exports.DummyCloudFunctionClient = DummyCloudFunctionClient;
//# sourceMappingURL=DummyCloudFunctionClient.js.map