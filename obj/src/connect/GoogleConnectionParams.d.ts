/** @module connect */
import { ConfigParams } from 'pip-services3-commons-nodex';
/**
 * Contains connection parameters to authenticate against Google Functions
 * and connect to specific Google Function.
 *
 * The class is able to compose and parse Google Function connection parameters.
 *
 * ### Configuration parameters ###
 *
 * - uri:           full connection uri with specific app and function name
 * - protocol:      connection protocol
 * - project_id:    is your Google Cloud Platform project ID
 * - region:        is the region where your function is deployed
 * - function_name: is the name of the HTTP function you deployed
 * - auth_token:    Google-generated ID token or null if using custom auth
 *
 * In addition to standard parameters [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/classes/auth.credentialparams.html CredentialParams]] may contain any number of custom parameters
 *
 * @see [[GoogleConnectionResolver]]
 *
 *
 * ### Example ###
 *
 *     let connection = GoogleConnectionParams.fromTuples(
 *         'connection.uri', 'http://east-my_test_project.cloudfunctions.net/myfunction',
 *         'connection.protocol', 'http',
 *         'connection.region', 'east',
 *         'connection.function_name', 'myfunction',
 *         'credential.project_id', 'my_test_project',
 *         'credential.auth_token', '1234',
 *     );
 *
 *     const uri = connection.getFunctionUri();             // Result: 'http://east-my_test_project.cloudfunctions.net/myfunction'
 *     const region = connection.getRegion();               // Result: 'east'
 *     const protocol = connection.getProtocol();           // Result: 'http'
 *     const functionName = connection.getFunctionName();   // Result: 'myfunction'
 *     const projectId = connection.getProjectId();         // Result: 'my_test_project'
 *     const authToken = connection.getAuthToken();         // Result: '123'
 */
export declare class GoogleConnectionParams extends ConfigParams {
    /**
     * Creates an new instance of the connection parameters.
     *
     * @param values 	(optional) an object to be converted into key-value pairs to initialize this connection.
     */
    constructor(values?: any);
    /**
     * Gets the Google function connection protocol.
     *
     * @returns {string} the Google function connection protocol.
     */
    getProtocol(): string;
    /**
     * Sets the Google function connection protocol.
     *
     * @param value a new Google function connection protocol.
     */
    setProtocol(value: string): void;
    /**
     * Gets the Google function uri.
     *
     * @returns {string} the Google function uri.
     */
    getFunctionUri(): string;
    /**
     * Sets the Google function uri.
     *
     * @param value a new Google function uri.
     */
    setFunctionUri(value: string): void;
    /**
     * Gets the Google function name.
     *
     * @returns {string} the Google function name.
     */
    getFunctionName(): string;
    /**
     * Sets the Google function name.
     *
     * @param value a new Google function name.
     */
    setFunctionName(value: string): void;
    /**
    * Gets the region where your function is deployed.
    *
    * @returns {string} the region of deployed function.
    */
    getRegion(): string;
    /**
     * Sets the region where your function is deployed.
     *
     * @param value a new Google function name.
     */
    setRegion(value: string): void;
    /**
    * Gets the Google Cloud Platform project ID.
    *
    * @returns {string} the project ID.
    */
    getProjectId(): string;
    /**
     * Sets the Google Cloud Platform project ID.
     *
     * @param value a new project ID.
     */
    setProjectId(value: string): void;
    /**
   * Gets an ID token with the request to authenticate themselves
   *
   * @returns {string} the ID token.
   */
    getAuthToken(): string;
    /**
     * Sets an ID token with the request to authenticate themselves
     *
     * @param value a new ID token.
     */
    setAuthToken(value: string): void;
    /**
     * Creates a new GoogleConnectionParams object filled with key-value pairs serialized as a string.
     *
     * @param line 		                a string with serialized key-value pairs as "key1=value1;key2=value2;..."
     * 					                Example: "Key1=123;Key2=ABC;Key3=2016-09-16T00:00:00.00Z"
     * @returns {GoogleConnectionParams}	a new GoogleConnectionParams object.
     */
    static fromString(line: string): GoogleConnectionParams;
    /**
     * Validates this connection parameters
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     */
    validate(correlationId: string): void;
    /**
     * Retrieves GoogleConnectionParams from configuration parameters.
     * The values are retrieves from "connection" and "credential" sections.
     *
     * @param config 	                configuration parameters
     * @returns {GoogleConnectionParams}	the generated GoogleConnectionParams object.
     *
     * @see [[mergeConfigs]]
     */
    static fromConfig(config: ConfigParams): GoogleConnectionParams;
    /**
     * Retrieves GoogleConnectionParams from multiple configuration parameters.
     * The values are retrieves from "connection" and "credential" sections.
     *
     * @param configs 	                a list with configuration parameters
     * @returns {GoogleConnectionParams}	the generated GoogleConnectionParams object.
     *
     * @see [[fromConfig]]
     */
    static mergeConfigs(...configs: ConfigParams[]): GoogleConnectionParams;
}
