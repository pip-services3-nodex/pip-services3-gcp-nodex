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
exports.GoogleConnectionResolver = void 0;
/** @module connect */
const url = require('url');
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_components_nodex_2 = require("pip-services3-components-nodex");
const GoogleConnectionParams_1 = require("./GoogleConnectionParams");
/**
 * Helper class to retrieve Google connection and credential parameters,
 * validate them and compose a [[GoogleConnectionParams]] value.
 *
 * ### Configuration parameters ###
 *
 * - connections:
 *      - uri:           full connection uri with specific app and function name
 *      - protocol:      connection protocol
 *      - project_id:    is your Google Cloud Platform project ID
 *      - region:        is the region where your function is deployed
 *      - function_name: is the name of the HTTP function you deployed
 *
 * - credentials:
 *     - auth_token:    Google-generated ID token or null if using custom auth
 *
 * ### References ###
 *
 * - <code>\*:credential-store:\*:\*:1.0</code>  (optional) Credential stores to resolve credentials
 *
 * @see [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/classes/connect.connectionparams.html ConnectionParams]] (in the Pip.Services components package)
 *
 * ### Example ###
 *
 *     let config = ConfigParams.fromTuples(
 *         'connection.uri', 'http://east-my_test_project.cloudfunctions.net/myfunction',
 *         'connection.protocol', 'http',
 *         'connection.region', 'east',
 *         'connection.function_name', 'myfunction',
 *         'credential.project_id', 'my_test_project',
 *         'credential.auth_token', '1234',
 *     );
 *
 *     let connectionResolver = new GoogleConnectionResolver();
 *     connectionResolver.configure(config);
 *     connectionResolver.setReferences(references);
 *
 *     const connectionParams = await connectionResolver.resolve("123");
 */
class GoogleConnectionResolver {
    constructor() {
        /**
         * The connection resolver.
         */
        this._connectionResolver = new pip_services3_components_nodex_1.ConnectionResolver();
        /**
         * The credential resolver.
         */
        this._credentialResolver = new pip_services3_components_nodex_2.CredentialResolver();
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._connectionResolver.configure(config);
        this._credentialResolver.configure(config);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._connectionResolver.setReferences(references);
        this._credentialResolver.setReferences(references);
    }
    /**
     * Resolves connection and credential parameters and generates a single
     * GoogleConnectionParams value.
     *
     * @param correlationId             (optional) transaction id to trace execution through call chain.
     *
     * @return {GoogleConnectionParams} 	callback function that receives GoogleConnectionParams value or error.
     *
     * @see [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]] (in the Pip.Services components package)
     */
    resolve(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = new GoogleConnectionParams_1.GoogleConnectionParams();
            const connectionParams = yield this._connectionResolver.resolve(correlationId);
            connection.append(connectionParams);
            const credentialParams = yield this._credentialResolver.lookup(correlationId);
            connection.append(credentialParams);
            // Perform validation
            connection.validate(correlationId);
            connection = this.composeConnection(connection);
            return connection;
        });
    }
    composeConnection(connection) {
        connection = GoogleConnectionParams_1.GoogleConnectionParams.mergeConfigs(connection);
        let uri = connection.getFunctionUri();
        if (uri == null || uri == "") {
            let protocol = connection.getProtocol();
            let functionName = connection.getFunctionName();
            let projectId = connection.getProjectId();
            let region = connection.getRegion();
            // https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/FUNCTION_NAME
            uri = `${protocol}://${region}-${projectId}.cloudfunctions.net/${functionName}`;
            connection.setFunctionUri(uri);
        }
        else {
            let address = url.parse(uri);
            let protocol = ("" + address.protocol).replace(':', '');
            let functionName = address.path.replace('/', '');
            let region = uri.slice(uri.indexOf('//') + 2, uri.indexOf('-'));
            let projectId = uri.slice(uri.indexOf('-') + 1, uri.indexOf('.'));
            // let functionName = value.slice(-1) != '/' ? value.slice(value.lastIndexOf('/') + 1) : value.slice(value.slice(0, -1).lastIndexOf('/') + 1, -1);
            connection.setRegion(region);
            connection.setProjectId(projectId);
            connection.setFunctionName(functionName);
            connection.setProtocol(protocol);
            connection.setFunctionName(functionName);
        }
        return connection;
    }
}
exports.GoogleConnectionResolver = GoogleConnectionResolver;
//# sourceMappingURL=GoogleConnectionResolver.js.map