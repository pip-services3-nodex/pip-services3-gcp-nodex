import { Descriptor } from 'pip-services3-commons-nodex';

import { CommandableGoogleFunctionService } from '../../src/services/CommandableGoogleFunctionService';

export class DummyCommandableGoogleFunctionService extends CommandableGoogleFunctionService {
    public constructor() {
        super("dummies");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
    }
}
