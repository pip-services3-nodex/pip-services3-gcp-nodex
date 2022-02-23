/** @module clients */
import { IOpenable} from 'pip-services3-commons-nodex';
import { ConnectionException } from 'pip-services3-commons-nodex';
import { ApplicationExceptionFactory } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { IdGenerator } from 'pip-services3-commons-nodex';
import { UnknownException } from 'pip-services3-commons-nodex';
import { InvocationException } from 'pip-services3-commons-nodex';
import { DependencyResolver } from 'pip-services3-commons-nodex';
import { CompositeLogger } from 'pip-services3-components-nodex';
import { CompositeTracer } from 'pip-services3-components-nodex';
import { CompositeCounters } from 'pip-services3-components-nodex';
import { InstrumentTiming } from "pip-services3-rpc-nodex";

import { GcpConnectionParams } from '../connect/GcpConnectionParams';
import { GcpConnectionResolver } from '../connect/GcpConnectionResolver';


/**
 * Abstract client that calls Google Functions.
 * 
 * When making calls "cmd" parameter determines which what action shall be called, while
 * other parameters are passed to the action itself.
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
 * - <code>\*:logger:\*:\*:1.0</code>            (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>          (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>         (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:credential-store:\*:\*:1.0</code>  (optional) Credential stores to resolve credentials
 * 
 * @see [[CloudFunction]]
 * @see [[CommandableGoogleClient]]
 * 
 * ### Example ###
 * 
 *     class MyCloudFunctionClient extends CloudFunctionClient implements IMyClient {
 *         ...
 *      
 *         public async getData(correlationId: string, id: string): Promise<MyData> {
 *
 *             let timing = this.instrument(correlationId, 'myclient.get_data');
 *             const result = await this.call("get_data" correlationId, { id: id });
 *             timing.endTiming();
 *             return result;
 *         }
 *         ...
 *     }
 * 
 *     let client = new MyCloudFunctionClient();
 *     client.configure(ConfigParams.fromTuples(
 *         'connection.uri", "http://region-id.cloudfunctions.net/myfunction',
 *         'connection.protocol', 'http',
 *         'connection.region', 'region',
 *         'connection.function', 'myfunction',
 *         'connection.project_id', 'id',
 *         'credential.auth_token', 'XXX',
 *     ));
 *     
 *     const result = await client.getData("123", "1");
 */
export abstract class CloudFunctionClient implements IOpenable, IConfigurable, IReferenceable {
    /**
     * The HTTP client.
     */
    protected _client: any;
    /**
     * The Google Function connection parameters
     */
    protected _connection: GcpConnectionParams;

    protected _retries: number = 1;
    /**
     * The default headers to be added to every request.
     */
    protected _headers: any = {};
    /**
     * The connection timeout in milliseconds.
     */
    protected _connectTimeout: number = 10000;
    /**
     * The invocation timeout in milliseconds.
     */
    protected _timeout: number = 10000;
    /**
     * The remote service uri which is calculated on open.
     */
    protected _uri: string;

    /**
     * The dependencies resolver.
     */
    protected _dependencyResolver: DependencyResolver = new DependencyResolver();
    /**
     * The connection resolver.
     */
    protected _connectionResolver: GcpConnectionResolver = new GcpConnectionResolver();
    /**
     * The logger.
     */
    protected _logger: CompositeLogger = new CompositeLogger();
    /**
     * The performance counters.
     */
    protected _counters: CompositeCounters = new CompositeCounters();
    /**
     * The tracer.
     */
    protected _tracer: CompositeTracer = new CompositeTracer();

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        this._connectionResolver.configure(config);
		this._dependencyResolver.configure(config);

        this._connectTimeout = config.getAsIntegerWithDefault('options.connect_timeout', this._connectTimeout);
    }

    /**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._connectionResolver.setReferences(references);
        this._dependencyResolver.setReferences(references);
    }

    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a CounterTiming object that is used to end the time measurement.
     * 
     * @param correlationId         (optional) transaction id to trace execution through call chain.
     * @param name                  a method name.
     * @returns {InstrumentTiming}  object to end the time measurement.
     */
    protected instrument(correlationId: string, name: string): InstrumentTiming {
        this._logger.trace(correlationId, "Executing %s method", name);
        this._counters.incrementOne(name + ".exec_count");

        let counterTiming = this._counters.beginTiming(name + ".exec_time");
        let traceTiming = this._tracer.beginTrace(correlationId, name, null);
        return new InstrumentTiming(correlationId, name, "exec",
            this._logger, this._counters, counterTiming, traceTiming);
    }

    /**
	 * Checks if the component is opened.
	 * 
	 * @returns {boolean} true if the component has been opened and false otherwise.
     */
    public isOpen(): boolean {
        return this._client != null;
    }

    /**
	 * Opens the component.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
     *
     */
    public async open(correlationId: string): Promise<void> {
        if (this.isOpen()) {
            return;
        }

        this._connection = await this._connectionResolver.resolve(correlationId);
        if (this._connection.getAuthToken() != null)
            this._headers['Authorization'] = 'bearer ' + this._connection.getAuthToken();
        this._uri = this._connection.getUri();
        try {
            this._uri = this._connection.getUri();
            let restify = require('restify-clients');
            this._client = restify.createJsonClient({
                url: this._uri,
                connectTimeout: this._connectTimeout,
                requestTimeout: this._timeout,
                headers: this._headers,
                retry: {
                    minTimeout: this._timeout,
                    maxTimeout: Infinity,
                    retries: this._retries
                },
                version: '*'
            });

            this._logger.debug(correlationId, "Google function client connected to %s", this._connection.getUri());

        } catch (err) {
            this._client = null;

            throw new ConnectionException(
                correlationId, "CANNOT_CONNECT", "Connection to Google function service failed"
            ).wrap(err).withDetails("url", this._uri);
        }
    }

    /**
	 * Closes component and frees used resources.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    public async close(correlationId: string): Promise<void> {
        if (!this.isOpen()) {
            return;
        }
        if (this._client != null) {
            // Eat exceptions
            try {
                this._logger.debug(correlationId, "Closed Google function service at %s", this._uri);
            } catch (ex) {
                this._logger.warn(correlationId, "Failed while closing Google function service: %s", ex);
            }

            this._client = null;
            this._uri = null;
        }
    }

    /**
     * Performs Google Function invocation.
     * 
     * @param cmd               an action name to be called.
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param args              action arguments
     * @return {any}            action result.
     */
    protected async invoke<T>(cmd: string, correlationId: string, args: any): Promise<T> {
        if (cmd == null) {
            throw new UnknownException(null, 'NO_COMMAND', 'Missing Seneca pattern cmd');
        }

        args = Object.assign({}, args);
        args.cmd = cmd;
        args.correlation_id = correlationId || IdGenerator.nextShort();

        return new Promise((resolve, reject) => {
            let action = (err, req, res, data) => {
                // Handling 204 codes
                if (res && res.statusCode == 204)
                    resolve(null);
                else if (err == null)
                    resolve(data);
                else {
                    // Restore application exception
                    if (data != null)
                        err = ApplicationExceptionFactory.create(data).withCause(err);
                    reject(err);
                }
            };

            this._client.post(this._uri, args, action);
        });

    }    

    /**
     * Calls a Google Function action.
     * 
     * @param cmd               an action name to be called.
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param params            (optional) action parameters.
     * @return {any}            action result.
     */
    protected async call<T>(cmd: string, correlationId: string, params: any = {}): Promise<T> {
        return this.invoke<T>(cmd, correlationId, params);
    }

}