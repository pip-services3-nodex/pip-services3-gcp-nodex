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
let process = require('process');
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const DummyClientFixture_1 = require("./DummyClientFixture");
const DummyCommandableGoogleFunctionClient_1 = require("./DummyCommandableGoogleFunctionClient");
suite('DummyCommandableGoogleFunctionClient', () => {
    let functionName = process.env['GOOGLE_FUNCTION_NAME'];
    let protocol = process.env['GOOGLE_FUNCTION_PROTOCOL'];
    let region = process.env['GOOGLE_FUNCTION_REGION'];
    let projectId = process.env['GOOGLE_PROJECT_ID'];
    let uri = process.env['GOOGLE_FUNCTION_URI'] || 'http://localhost:3005';
    if (!uri && (!region || !functionName || !protocol || !projectId)) {
        return;
    }
    let config = pip_services3_commons_nodex_1.ConfigParams.fromTuples('connection.uri', uri, 'connection.protocol', protocol, 'connection.region', region, 'connection.function_name', functionName, 'credential.project_id', projectId);
    let client;
    let fixture;
    setup(() => __awaiter(void 0, void 0, void 0, function* () {
        client = new DummyCommandableGoogleFunctionClient_1.DummyCommandableGoogleFunctionClient();
        client.configure(config);
        fixture = new DummyClientFixture_1.DummyClientFixture(client, 'commandableHandler', 3005);
        if (uri == 'http://localhost:3005')
            yield fixture.startCloudServiceLocally();
        yield client.open(null);
    }));
    teardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield client.close(null);
        if (uri == 'http://localhost:3005')
            yield fixture.stopCloudServiceLocally();
    }));
    test('Crud Operations', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fixture.testCrudOperations();
    }));
});
//# sourceMappingURL=DummyCommandableGoogleFunctionClient.test.js.map