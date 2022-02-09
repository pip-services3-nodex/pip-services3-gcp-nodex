/** @module connect */
import { ConfigParams } from 'pip-services3-commons-nodex';
import { StringValueMap } from 'pip-services3-commons-nodex';
import { ConfigException } from 'pip-services3-commons-nodex';
import { CredentialParams } from 'pip-services3-components-nodex';
import { ConnectionParams } from 'pip-services3-components-nodex';

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
export class GoogleConnectionParams extends ConfigParams {
    /**
     * Creates an new instance of the connection parameters.
     * 
	 * @param values 	(optional) an object to be converted into key-value pairs to initialize this connection.
     */
    public constructor(values: any = null) {
        super(values);
    }

    /**
     * Gets the Google function connection protocol.
     *
     * @returns {string} the Google function connection protocol.
     */
    public getProtocol(): string {
        return super.getAsNullableString("protocol");
    }

    /**
     * Sets the Google function connection protocol.
     *
     * @param value a new Google function connection protocol.
     */
    public setProtocol(value: string) {
        super.put("protocol", value);
    }

    /**
     * Gets the Google function uri.
     *
     * @returns {string} the Google function uri.
     */
    public getFunctionUri(): string {
        return super.getAsNullableString("uri");
    }

    /**
     * Sets the Google function uri.
     *
     * @param value a new Google function uri.
     */
    public setFunctionUri(value: string) {
        super.put("uri", value);
    }


    /**
     * Gets the Google function name.
     *
     * @returns {string} the Google function name.
     */
    public getFunctionName(): string {
        return super.getAsNullableString("function_name");
    }

    /**
     * Sets the Google function name.
     *
     * @param value a new Google function name.
     */
    public setFunctionName(value: string) {
        super.put("function_name", value);
    }

    /**
    * Gets the region where your function is deployed.
    *
    * @returns {string} the region of deployed function.
    */
    public getRegion(): string {
        return super.getAsNullableString("region");
    }

    /**
     * Sets the region where your function is deployed.
     *
     * @param value a new Google function name.
     */
    public setRegion(value: string) {
        super.put("region", value);
    }

   /**
   * Gets the Google Cloud Platform project ID.
   *
   * @returns {string} the project ID.
   */
    public getProjectId(): string {
        return super.getAsNullableString("project_id");
    }

    /**
     * Sets the Google Cloud Platform project ID.
     *
     * @param value a new project ID.
     */
    public setProjectId(value: string) {
        super.put("project_id", value);
    }

    /**
   * Gets an ID token with the request to authenticate themselves
   *
   * @returns {string} the ID token.
   */
    public getAuthToken(): string {
        return super.getAsNullableString("auth_token");
    }

    /**
     * Sets an ID token with the request to authenticate themselves
     *
     * @param value a new ID token.
     */
    public setAuthToken(value: string) {
        super.put("auth_token", value);
    }

    /**
	 * Creates a new GoogleConnectionParams object filled with key-value pairs serialized as a string.
	 * 
	 * @param line 		                a string with serialized key-value pairs as "key1=value1;key2=value2;..."
	 * 					                Example: "Key1=123;Key2=ABC;Key3=2016-09-16T00:00:00.00Z"
	 * @returns {GoogleConnectionParams}	a new GoogleConnectionParams object.
     */
    public static fromString(line: string): GoogleConnectionParams {
        let map = StringValueMap.fromString(line);
        return new GoogleConnectionParams(map);
    }

    /**
     * Validates this connection parameters 
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     */
    public validate(correlationId: string) {
        const uri = this.getFunctionUri();
        const protocol = this.getProtocol();
        const functionName = this.getFunctionName();
        const region = this.getRegion();
        const projectId = this.getProjectId();

        if (uri === null && (projectId == null &&  region == null && functionName === null && protocol === null)) {
            throw new ConfigException(
                correlationId,
                "NO_CONNECTION_URI",
                "No uri, app_name and function_name is configured in Auzre function uri"
            );
        }

        if (protocol != null && "http" != protocol && "https" != protocol) {
            throw new ConfigException(
                correlationId, "WRONG_PROTOCOL", "Protocol is not supported by REST connection")
                .withDetails("protocol", protocol);
        }
    }

    /**
	 * Retrieves GoogleConnectionParams from configuration parameters.
     * The values are retrieves from "connection" and "credential" sections.
	 * 
	 * @param config 	                configuration parameters
	 * @returns {GoogleConnectionParams}	the generated GoogleConnectionParams object.
	 * 
	 * @see [[mergeConfigs]]
	 */
    public static fromConfig(config: ConfigParams): GoogleConnectionParams {
        let result = new GoogleConnectionParams();

        let credentials = CredentialParams.manyFromConfig(config);
        for (let credential of credentials)
            result.append(credential);

        let connections = ConnectionParams.manyFromConfig(config);
        for (let connection of connections)
            result.append(connection);

        return result;
    }

    /**
	 * Retrieves GoogleConnectionParams from multiple configuration parameters.
     * The values are retrieves from "connection" and "credential" sections.
	 * 
	 * @param configs 	                a list with configuration parameters
	 * @returns {GoogleConnectionParams}	the generated GoogleConnectionParams object.
	 * 
	 * @see [[fromConfig]]
	 */
    public static mergeConfigs(...configs: ConfigParams[]): GoogleConnectionParams {
        let config = ConfigParams.mergeConfigs(...configs);
        return new GoogleConnectionParams(config);
    }
}