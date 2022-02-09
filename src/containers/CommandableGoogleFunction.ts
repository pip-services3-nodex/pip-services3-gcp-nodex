/** @module containers */
import { ICommandable } from 'pip-services3-commons-nodex';
import { CommandSet } from 'pip-services3-commons-nodex';
import { Parameters } from 'pip-services3-commons-nodex';
import { HttpResponseSender } from 'pip-services3-rpc-nodex';

import { GoogleFunction } from './GoogleFunction';
import {GoogleFunctionRequestHelper} from "./GoogleFunctionRequestHelper";

/**
 * Abstract Google Function function, that acts as a container to instantiate and run components
 * and expose them via external entry point. All actions are automatically generated for commands
 * defined in [[https://pip-services3-nodex.github.io/pip-services3-commons-nodex/interfaces/commands.icommandable.html ICommandable components]]. Each command is exposed as an action defined by "cmd" parameter.
 *  
 * Container configuration for this Google Function is stored in <code>"./config/config.yml"</code> file.
 * But this path can be overridden by <code>CONFIG_PATH</code> environment variable.
 * 
 * Note: This component has been deprecated. Use GoogleFunctionService instead.
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>            (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>          (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:service:google-function:\*:1.0</code>       (optional) [[https://pip-services3-nodex.github.io/pip-services3-gcp-nodex/interfaces/services.igooglefunctionservice.html IGoogleFunctionService]] services to handle action requests
 * - <code>\*:service:commandable-google-function:\*:1.0</code> (optional) [[https://pip-services3-nodex.github.io/pip-services3-gcp-nodex/interfaces/services.igooglefunctionservice.html IGoogleFunctionService]] services to handle action requests
 *
 * 
 * ### Example ###
 * 
 *     class MyGoogleFunction extends CommandableGoogleFunction {
 *         private _controller: IMyController;
 *         ...
 *         public constructor() {
 *             base("mygroup", "MyGroup GoogleFunction");
 *             this._dependencyResolver.put(
 *                 "controller",
 *                 new Descriptor("mygroup","controller","*","*","1.0")
 *             );
 *         }
 *     }
 * 
 *     let googleFunction = new MyGoogleFunction();
 *     
 *     await service.run();
 *     console.log("MyGoogleFunction is started");
 */
export abstract class CommandableGoogleFunction extends GoogleFunction {

    /**
     * Creates a new instance of this Google Function.
     * 
     * @param name          (optional) a container name (accessible via ContextInfo)
     * @param description   (optional) a container description (accessible via ContextInfo)
     */
    public constructor(name: string, description?: string) {
        super(name, description);
        this._dependencyResolver.put('controller', 'none');
    }

    /**
     * Returns body from Google Function request.
     * This method can be overloaded in child classes
     * @param req -  Googl Function request
     * @return Returns Parameters from request
     */
    protected getParametrs(req: any): Parameters {
        return GoogleFunctionRequestHelper.getParametrs(req);
    }

    private registerCommandSet(commandSet: CommandSet) {
        let commands = commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            let command = commands[index];

            this.registerAction(command.getName(), null, async (req, res) => {
                let correlationId = this.getCorrelationId(req);
                let args = this.getParametrs(req);
                let timing = this.instrument(correlationId, this._info.name + '.' + command.getName());

                try {
                    const result = await command.execute(correlationId, args);
                    timing.endTiming();
                    HttpResponseSender.sendResult(req, res, result);
                } catch (err) {
                    timing.endTiming(err);
                    throw err;
                }
            });
        }
    }

    /**
     * Registers all actions in this Google Function.
     */
    public register(): void {
        let controller: ICommandable = this._dependencyResolver.getOneRequired<ICommandable>('controller');
        let commandSet = controller.getCommandSet();
        this.registerCommandSet(commandSet);
    }
}
