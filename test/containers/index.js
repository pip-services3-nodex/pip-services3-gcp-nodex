const DummyCommandableGoogleFunction = require('../../obj/test/containers/DummyCommandableGoogleFunction').DummyCommandableGoogleFunction;
const DummyGoogleFunction = require('../../obj/test/containers/DummyGoogleFunction').DummyGoogleFunction;
const ConfigParams = require('../../node_modules/pip-services3-commons-nodex/obj/src/config/ConfigParams').ConfigParams;

// CommandableGoogleFunction
let commandableFunction = null;

exports.commandableHandler = async (req, res) => {
    let config = ConfigParams.fromTuples(
        'logger.descriptor', 'pip-services:logger:console:default:1.0',
        'controller.descriptor', 'pip-services-dummies:controller:default:default:1.0'
    );

    if (commandableFunction == null) {
        commandableFunction = new DummyCommandableGoogleFunction();
        commandableFunction.configure(config);
        await commandableFunction.open(null);
    }

    let handler = commandableFunction.getHandler();
    handler(req, res);
};


// GoogleFunction
let gFunction = null;

exports.handler = async (req, res) => {
    let config = ConfigParams.fromTuples(
        'logger.descriptor', 'pip-services:logger:console:default:1.0',
        'controller.descriptor', 'pip-services-dummies:controller:default:default:1.0'
    );
    
    if (gFunction == null) {
        gFunction = new DummyGoogleFunction();
        gFunction.configure(config);
        await gFunction.open(null);
    }

    let handler = gFunction.getHandler();
    handler(req, res);
};