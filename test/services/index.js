const DummyCommandableCloudFunction = require('../../obj/test/services/DummyCommandableCloudFunction').DummyCommandableCloudFunction;
const DummyCloudFunction = require('../../obj/test/services/DummyCloudFunction').DummyCloudFunction;
const ConfigParams = require('../../node_modules/pip-services3-commons-nodex/obj/src/config/ConfigParams').ConfigParams;

// CommandableCloudFunctionService
let commandableFunctionService = null;
exports.commandableHandler = async (req, res) => {
    let config = ConfigParams.fromTuples(
        'logger.descriptor', 'pip-services:logger:console:default:1.0',
        'controller.descriptor', 'pip-services-dummies:controller:default:default:1.0',
        'service.descriptor', 'pip-services-dummies:service:commandable-gcp-function:default:1.0'
    );
    
    if (commandableFunctionService == null) {
        commandableFunctionService = new DummyCommandableCloudFunction();
        commandableFunctionService.configure(config);
        await commandableFunctionService.open(null);
    }
    
    let handler = commandableFunctionService.getHandler();

    handler(req, res);
};

// CloudFunctionService
let functionService = null;

exports.handler = async (req, res) => {
    let config = ConfigParams.fromTuples(
        'logger.descriptor', 'pip-services:logger:console:default:1.0',
        'controller.descriptor', 'pip-services-dummies:controller:default:default:1.0',
        'service.descriptor', 'pip-services-dummies:service:gcp-function:default:1.0'
    );

    if (functionService == null) {
        functionService = new DummyCloudFunction();
        functionService.configure(config);
        await functionService.open(null);
    }
    
    let handler = functionService.getHandler();

    handler(req, res);
};