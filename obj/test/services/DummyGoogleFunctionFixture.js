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
exports.DummyGoogleFunctionFixture = void 0;
const assert = require('chai').assert;
const restify = require('restify');
const waitPort = require('wait-port');
const child_process_1 = require("child_process");
class DummyGoogleFunctionFixture {
    constructor(functionName, port = 3000) {
        this.functionName = functionName;
        this.port = port;
        let url = `http://localhost:${port}`;
        this.rest = restify.createJsonClient({
            url: url, version: '*',
            retry: {
                'retries': 0
            }
        });
    }
    startCloudServiceLocally() {
        return __awaiter(this, void 0, void 0, function* () {
            let ff = (0, child_process_1.exec)(`npx functions-framework --target=${this.functionName} --signature-type=http --port=${this.port} --source=test/services`);
            yield waitPort({ host: 'localhost', port: this.port });
            this.process = ff;
            yield new Promise((resolve, reject) => {
                setTimeout(resolve, 500);
            });
        });
    }
    stopCloudServiceLocally() {
        return __awaiter(this, void 0, void 0, function* () {
            this.process.kill();
            this.process = null;
            // Hack to close all sockets from functions-framework
            process['_getActiveHandles']().forEach(element => {
                if (element.constructor.name == 'Socket')
                    element.emit('close');
            });
        });
    }
    httpInvoke(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield new Promise((resolve, reject) => {
                this.rest.post('/' + this.functionName, data, (err, req, res, entity) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve(Object.keys(entity).length > 0 ? entity : null);
                });
            });
            return response;
        });
    }
    testCrudOperations() {
        return __awaiter(this, void 0, void 0, function* () {
            let DUMMY1 = { id: null, key: "Key 1", content: "Content 1" };
            let DUMMY2 = { id: null, key: "Key 2", content: "Content 2" };
            // Create one dummy
            let dummy1 = yield this.httpInvoke({
                cmd: 'dummies.create_dummy',
                dummy: DUMMY1
            });
            assert.isObject(dummy1);
            assert.equal(dummy1.content, DUMMY1.content);
            assert.equal(dummy1.key, DUMMY1.key);
            // Create another dummy
            let dummy2 = yield this.httpInvoke({
                cmd: 'dummies.create_dummy',
                dummy: DUMMY2
            });
            assert.isObject(dummy2);
            assert.equal(dummy2.content, DUMMY2.content);
            assert.equal(dummy2.key, DUMMY2.key);
            // Update the dummy
            dummy1.content = 'Updated Content 1';
            const updatedDummy1 = yield this.httpInvoke({
                cmd: 'dummies.update_dummy',
                dummy: dummy1
            });
            assert.isObject(updatedDummy1);
            assert.equal(updatedDummy1.id, dummy1.id);
            assert.equal(updatedDummy1.content, dummy1.content);
            assert.equal(updatedDummy1.key, dummy1.key);
            dummy1 = updatedDummy1;
            // Delete dummy
            let deleted = yield this.httpInvoke({
                cmd: 'dummies.delete_dummy',
                dummy_id: dummy1.id
            });
            assert.isObject(deleted);
            assert.equal(deleted.id, dummy1.id);
            assert.equal(deleted.content, dummy1.content);
            assert.equal(deleted.key, dummy1.key);
            let dummy = yield this.httpInvoke({
                cmd: 'dummies.get_dummy_by_id',
                dummy_id: dummy1.id
            });
            assert.isNull(dummy || null);
        });
    }
}
exports.DummyGoogleFunctionFixture = DummyGoogleFunctionFixture;
//# sourceMappingURL=DummyGoogleFunctionFixture.js.map