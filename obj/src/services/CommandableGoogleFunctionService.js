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
exports.CommandableGoogleFunctionService = void 0;
const GoogleFunctionService_1 = require("./GoogleFunctionService");
const GoogleFunctionRequestHelper_1 = require("../containers/GoogleFunctionRequestHelper");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
/**
 * Abstract service that receives commands via Google Function protocol
 * to operations automatically generated for commands defined in [[https://pip-services3-nodex.github.io/pip-services3-commons-nodex/interfaces/commands.icommandable.html ICommandable components]].
 * Each command is exposed as invoke method that receives command name and parameters.
 *
 * Commandable services require only 3 lines of code to implement a robust external
 * Google Function-based remote interface.
 *
 * This service is intended to work inside Google Function container that
 * exploses registered actions externally.
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
 * @see [[GoogleFunctionService]]
 *
 * ### Example ###
 *
 *     class MyCommandableGoogleFunctionService extends CommandableGoogleFunctionService {
 *        public constructor() {
 *           base();
 *           this._dependencyResolver.put(
 *               "controller",
 *               new Descriptor("mygroup","controller","*","*","1.0")
 *           );
 *        }
 *     }
 *
 *     let service = new MyCommandableGoogleFunctionService();
 *     service.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","controller","default","default","1.0"), controller
 *     ));
 *
 *     await service.open("123");
 *     console.log("The Google Function service is running");
 */
class CommandableGoogleFunctionService extends GoogleFunctionService_1.GoogleFunctionService {
    /**
     * Creates a new instance of the service.
     *
     * @param name a service name.
     */
    constructor(name) {
        super(name);
        this._dependencyResolver.put('controller', 'none');
    }
    /**
     * Returns body from Google Function request.
     * This method can be overloaded in child classes
     * @param req -  Google Function request
     * @return Returns Parameters from request
     */
    getParametrs(req) {
        return GoogleFunctionRequestHelper_1.GoogleFunctionRequestHelper.getParametrs(req);
    }
    /**
     * Registers all actions in Google Function.
     */
    register() {
        let controller = this._dependencyResolver.getOneRequired('controller');
        this._commandSet = controller.getCommandSet();
        let commands = this._commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            let command = commands[index];
            let name = command.getName();
            this.registerAction(name, null, (req, res) => __awaiter(this, void 0, void 0, function* () {
                let correlationId = this.getCorrelationId(req);
                let args = this.getParametrs(req);
                args.remove("correlation_id");
                let timing = this.instrument(correlationId, name);
                try {
                    const result = yield command.execute(correlationId, args);
                    pip_services3_rpc_nodex_1.HttpResponseSender.sendResult(req, res, result);
                }
                catch (ex) {
                    timing.endFailure(ex);
                }
                finally {
                    timing.endTiming();
                }
            }));
        }
    }
}
exports.CommandableGoogleFunctionService = CommandableGoogleFunctionService;
//# sourceMappingURL=CommandableGoogleFunctionService.js.map