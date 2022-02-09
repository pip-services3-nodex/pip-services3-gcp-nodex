const DummyCommandableGoogleFunction = require('../../obj/test/services/DummyCommandableGoogleFunction').DummyCommandableGoogleFunction;
const DummyGoogleFunction = require('../../obj/test/services/DummyGoogleFunction').DummyGoogleFunction;
const ConfigParams = require('../../node_modules/pip-services3-commons-nodex/obj/src/config/ConfigParams').ConfigParams;

// CommandableGoogleFunctionService
let commandableFunctionService = null;
exports.commandableHandler = async (req, res) => {
    let config = ConfigParams.fromTuples(
        'logger.descriptor', 'pip-services:logger:console:default:1.0',
        'controller.descriptor', 'pip-services-dummies:controller:default:default:1.0',
        'service.descriptor', 'pip-services-dummies:service:commandable-google-function:default:1.0'
    );
    
    if (commandableFunctionService == null) {
        commandableFunctionService = new DummyCommandableGoogleFunction();
        commandableFunctionService.configure(config);
        await commandableFunctionService.open(null);
    }
    
    let handler = commandableFunctionService.getHandler();

    handler(req, res);
};

// GoogleFunctionService
let functionService = null;

exports.handler = async (req, res) => {
    let config = ConfigParams.fromTuples(
        'logger.descriptor', 'pip-services:logger:console:default:1.0',
        'controller.descriptor', 'pip-services-dummies:controller:default:default:1.0',
        'service.descriptor', 'pip-services-dummies:service:google-function:default:1.0'
    );

    if (functionService == null) {
        functionService = new DummyGoogleFunction();
        functionService.configure(config);
        await functionService.open(null);
    }
    
    let handler = functionService.getHandler();

    handler(req, res);
};