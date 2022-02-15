import { IConfigurable } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { ConnectionResolver } from 'pip-services3-components-nodex';
import { CredentialResolver } from 'pip-services3-components-nodex';
import { GcpConnectionParams } from './GcpConnectionParams';
/**
 * Helper class to retrieve Google connection and credential parameters,
 * validate them and compose a [[GcpConnectionParams]] value.
 *
 * ### Configuration parameters ###
 *
 * - connections:
 *      - uri:           full connection uri with specific app and function name
 *      - protocol:      connection protocol
 *      - project_id:    is your Google Cloud Platform project ID
 *      - region:        is the region where your function is deployed
 *      - function:      is the name of the HTTP function you deployed
 *      - org_id:        organization name
 *
 * - credentials:
 *     - account: the service account name
 *     - auth_token:    Google-generated ID token or null if using custom auth (IAM)
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
 *         'connection.function', 'myfunction',
 *         'connection.project_id', 'my_test_project',
 *         'credential.auth_token', '1234',
 *     );
 *
 *     let connectionResolver = new GcpConnectionResolver();
 *     connectionResolver.configure(config);
 *     connectionResolver.setReferences(references);
 *
 *     const connectionParams = await connectionResolver.resolve("123");
 */
export declare class GcpConnectionResolver implements IConfigurable, IReferenceable {
    /**
     * The connection resolver.
     */
    protected _connectionResolver: ConnectionResolver;
    /**
     * The credential resolver.
     */
    protected _credentialResolver: CredentialResolver;
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Resolves connection and credential parameters and generates a single
     * GcpConnectionParams value.
     *
     * @param correlationId             (optional) transaction id to trace execution through call chain.
     *
     * @return {GcpConnectionParams} 	callback function that receives GcpConnectionParams value or error.
     *
     * @see [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]] (in the Pip.Services components package)
     */
    resolve(correlationId: string): Promise<GcpConnectionParams>;
    private composeConnection;
}
