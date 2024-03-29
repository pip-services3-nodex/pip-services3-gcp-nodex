"use strict";
/** @module services */
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
exports.CloudFunctionService = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_components_nodex_2 = require("pip-services3-components-nodex");
const pip_services3_components_nodex_3 = require("pip-services3-components-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const CloudFunctionRequestHelper_1 = require("../containers/CloudFunctionRequestHelper");
/**
 * Abstract service that receives remove calls via Google Function protocol.
 *
 * This service is intended to work inside CloudFunction container that
 * exposes registered actions externally.
 *
 * ### Configuration parameters ###
 *
 * - dependencies:
 *   - controller:            override for Controller dependency
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>               (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>             (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 *
 *
 * ### Example ###
 *
 *     class MyCloudFunctionService extends CloudFunctionService {
 *        private _controller: IMyController;
 *        ...
 *        public constructor() {
 *           base('v1.myservice');
 *           this._dependencyResolver.put(
 *               "controller",
 *               new Descriptor("mygroup","controller","*","*","1.0")
 *           );
 *        }
 *
 *        public setReferences(references: IReferences): void {
 *           base.setReferences(references);
 *           this._controller = this._dependencyResolver.getRequired<IMyController>("controller");
 *        }
 *
 *        public register(): void {
 *            registerAction("get_mydata", null, async (req, res) => {
 *                let params = req.body;
 *                let correlationId = params.correlation_id;
 *                let id = params.id;
 *                const result = await this._controller.getMyData(correlationId, id);
 *
 *                res.send(result);
 *            });
 *            ...
 *        }
 *     }
 *
 *     let service = new MyCloudFunctionService();
 *     service.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *     service.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","controller","default","default","1.0"), controller
 *     ));
 *
 *     service.open("123");
 */
class CloudFunctionService {
    /**
     * Creates an instance of this service.
     * @param name a service name to generate action cmd.
     */
    constructor(name) {
        this._actions = [];
        this._interceptors = [];
        /**
         * The dependency resolver.
         */
        this._dependencyResolver = new pip_services3_commons_nodex_1.DependencyResolver();
        /**
         * The logger.
         */
        this._logger = new pip_services3_components_nodex_1.CompositeLogger();
        /**
         * The performance counters.
         */
        this._counters = new pip_services3_components_nodex_2.CompositeCounters();
        /**
         * The tracer.
         */
        this._tracer = new pip_services3_components_nodex_3.CompositeTracer();
        this._name = name;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._tracer.setReferences(references);
        this._dependencyResolver.setReferences(references);
    }
    /**
     * Get all actions supported by the service.
     * @returns an array with supported actions.
     */
    getActions() {
        return this._actions;
    }
    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a Timing object that is used to end the time measurement.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param name              a method name.
     * @returns Timing object to end the time measurement.
     */
    instrument(correlationId, name) {
        this._logger.trace(correlationId, "Executing %s method", name);
        this._counters.incrementOne(name + ".exec_count");
        let counterTiming = this._counters.beginTiming(name + ".exec_time");
        let traceTiming = this._tracer.beginTrace(correlationId, name, null);
        return new pip_services3_rpc_nodex_1.InstrumentTiming(correlationId, name, "exec", this._logger, this._counters, counterTiming, traceTiming);
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._opened;
    }
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    open(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._opened) {
                return;
            }
            this.register();
            this._opened = true;
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    close(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._opened) {
                return;
            }
            this._opened = false;
            this._actions = [];
            this._interceptors = [];
        });
    }
    applyValidation(schema, action) {
        // Create an action function
        let actionWrapper = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // Validate object
            if (schema && req) {
                // Perform validation
                let params = Object.assign({}, req.params, req.query, { body: req.body });
                let correlationId = this.getCorrelationId(req);
                let err = schema.validateAndReturnException(correlationId, params, false);
                if (err) {
                    pip_services3_rpc_nodex_1.HttpResponseSender.sendError(req, res, err);
                }
            }
            return action.call(this, req, res);
        });
        return actionWrapper;
    }
    applyInterceptors(action) {
        let actionWrapper = action;
        for (let index = this._interceptors.length - 1; index >= 0; index--) {
            let interceptor = this._interceptors[index];
            actionWrapper = ((action) => {
                return (req, res) => {
                    return interceptor(req, res, action);
                };
            })(actionWrapper);
        }
        return actionWrapper;
    }
    generateActionCmd(name) {
        let cmd = name;
        if (this._name != null) {
            cmd = this._name + "." + cmd;
        }
        return cmd;
    }
    /**
     * Registers a action in Google Function function.
     *
     * @param name          an action name
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when operation is invoked.
     */
    registerAction(name, schema, action) {
        let actionWrapper = this.applyValidation(schema, action);
        actionWrapper = this.applyInterceptors(actionWrapper);
        let self = this;
        let registeredAction = {
            cmd: this.generateActionCmd(name),
            schema: schema,
            action: (req, res) => { return actionWrapper.call(self, req, res); }
        };
        this._actions.push(registeredAction);
    }
    /**
     * Registers an action with authorization.
     *
     * @param name          an action name
     * @param schema        a validation schema to validate received parameters.
     * @param authorize     an authorization interceptor
     * @param action        an action function that is called when operation is invoked.
     */
    registerActionWithAuth(name, schema, authorize, action) {
        let actionWrapper = this.applyValidation(schema, action);
        // Add authorization just before validation
        actionWrapper = (req, res) => {
            return authorize(req, res, actionWrapper);
        };
        actionWrapper = this.applyInterceptors(actionWrapper);
        let self = this;
        let registeredAction = {
            cmd: this.generateActionCmd(name),
            schema: schema,
            action: (req, res) => { return actionWrapper.call(self, req, res); }
        };
        this._actions.push(registeredAction);
    }
    /**
     * Registers a middleware for actions in Google Function service.
     *
     * @param action an action function that is called when middleware is invoked.
     */
    registerInterceptor(cmd, action) {
        let self = this;
        let interceptorWrapper = (req, res, next) => {
            let currCmd = this.getCommand(req);
            let match = (currCmd.match(cmd) || []).length > 0;
            if (cmd != null && cmd != "" && !match)
                next.call(self, req, res);
            else
                action.call(self, req, res, next);
        };
        this._interceptors.push(interceptorWrapper);
    }
    /**
     * Returns correlationId from Google Function request.
     * This method can be overloaded in child classes
     * @param req - the function request
     * @return returns correlationId from request
     */
    getCorrelationId(req) {
        return CloudFunctionRequestHelper_1.CloudFunctionRequestHelper.getCorrelationId(req);
    }
    /**
     * Returns command from Google Function request.
     * This method can be overloaded in child classes
     * @param req -  the function request
     * @return returns command from request
     */
    getCommand(req) {
        return CloudFunctionRequestHelper_1.CloudFunctionRequestHelper.getCommand(req);
    }
}
exports.CloudFunctionService = CloudFunctionService;
//# sourceMappingURL=CloudFunctionService.js.map