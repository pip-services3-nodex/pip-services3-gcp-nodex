/** @module clients */
import { CloudFunctionClient } from './CloudFunctionClient';

/**
 * Abstract client that calls commandable Google Cloud Functions.
 * 
 * Commandable services are generated automatically for [[https://pip-services3-nodex.github.io/pip-services3-commons-nodex/interfaces/commands.icommandable.html ICommandable objects]].
 * Each command is exposed as action determined by "cmd" parameter.
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
 * - options:
 *      - retries:               number of retries (default: 3)
 *      - connect_timeout:       connection timeout in milliseconds (default: 10 sec)
 *      - timeout:               invocation timeout in milliseconds (default: 10 sec)
 * - credentials:   
 *     - account: the service account name 
 *     - auth_token:    Google-generated ID token or null if using custom auth (IAM)
 *  
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>            (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>          (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>         (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:credential-store:\*:\*:1.0</code>  (optional) Credential stores to resolve credentials
 * 
 * @see [[CloudFunction]]
 * 
 * ### Example ###
 * 
 *     class MyCommandableGoogleClient extends CommandableCloudFunctionClient implements IMyClient {
 *         ...
 *      
 *         public async getData(correlationId: string, id: string): Promise<any> {
 *             return this.callCommand("get_data", correlationId, { id: id });
 *         }
 *         ...
 *     }
 * 
 *     let client = new MyCommandableGoogleClient();
 *     client.configure(ConfigParams.fromTuples(
 *          'connection.uri", "http://region-id.cloudfunctions.net/myfunction',
 *          'connection.protocol', 'http',
            'connection.region', 'region',
            'connection.function', 'myfunction',
            'connection.project_id', 'id',
            'credential.auth_token', 'XXX',
 *     ));
 *
 *     const result = await client.getData("123", "1");
 *     ...
 */
export class CommandableCloudFunctionClient extends CloudFunctionClient {
    private readonly _name: string;

    /**
     * Creates a new instance of this client.
     * 
     * @param name a service name.
     */
    public constructor(name: string) {
        super();
        this._name = name;
    }

    /**
     * Calls a remote action in Google Function.
     * The name of the action is added as "cmd" parameter
     * to the action parameters. 
     * 
     * @param cmd               an action name
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param params            command parameters.
     * @return {any}            action result.
     */
    public async callCommand<T>(cmd: string, correlationId: string, params: any): Promise<T> {
        const timing = this.instrument(correlationId, this._name + '.' + cmd);
        try {
            const result = await this.call<T>(cmd, correlationId, params);
            timing.endTiming();
            return result;
        } catch (err) {
            timing.endTiming(err);
            throw err;
        }
    }
}