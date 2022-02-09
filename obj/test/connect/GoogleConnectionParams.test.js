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
const assert = require('chai').assert;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const GoogleConnectionParams_1 = require("../../src/connect/GoogleConnectionParams");
const GoogleConnectionResolver_1 = require("../../src/connect/GoogleConnectionResolver");
suite('GoogleConnectionParams', () => {
    test('Test Empty Connection', () => __awaiter(void 0, void 0, void 0, function* () {
        let connection = new GoogleConnectionParams_1.GoogleConnectionParams();
        assert.isNull(connection.getFunctionUri());
        assert.isNull(connection.getProjectId());
        assert.isNull(connection.getFunctionName());
        assert.isNull(connection.getRegion());
        assert.isNull(connection.getProtocol());
        assert.isNull(connection.getAuthToken());
    }));
    test('Compose Config', () => __awaiter(void 0, void 0, void 0, function* () {
        const config1 = pip_services3_commons_nodex_1.ConfigParams.fromTuples('connection.uri', 'http://east-my_test_project.cloudfunctions.net/myfunction', 'credential.auth_token', '1234');
        const config2 = pip_services3_commons_nodex_1.ConfigParams.fromTuples('connection.protocol', 'http', 'connection.region', 'east', 'connection.function_name', 'myfunction', 'credential.project_id', 'my_test_project', 'credential.auth_token', '1234');
        let resolver = new GoogleConnectionResolver_1.GoogleConnectionResolver();
        resolver.configure(config1);
        let connection = yield resolver.resolve('');
        assert.equal('http://east-my_test_project.cloudfunctions.net/myfunction', connection.getFunctionUri());
        assert.equal('east', connection.getRegion());
        assert.equal('http', connection.getProtocol());
        assert.equal('myfunction', connection.getFunctionName());
        assert.equal('my_test_project', connection.getProjectId());
        assert.equal('1234', connection.getAuthToken());
        resolver = new GoogleConnectionResolver_1.GoogleConnectionResolver();
        resolver.configure(config2);
        connection = yield resolver.resolve('');
        assert.equal('http://east-my_test_project.cloudfunctions.net/myfunction', connection.getFunctionUri());
        assert.equal('east', connection.getRegion());
        assert.equal('http', connection.getProtocol());
        assert.equal('myfunction', connection.getFunctionName());
        assert.equal('my_test_project', connection.getProjectId());
        assert.equal('1234', connection.getAuthToken());
    }));
});
//# sourceMappingURL=GoogleConnectionParams.test.js.map