import { CommandableGoogleFunction } from '../../src/containers/CommandableGoogleFunction';
import { DummyFactory } from '../DummyFactory';
import { Descriptor } from "pip-services3-commons-nodex";

export class DummyCommandableGoogleFunction extends CommandableGoogleFunction {
    public constructor() {
        super("dummy", "Dummy commandable lambda function");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
        this._factories.add(new DummyFactory());
    }
}

export const commandableHandler = new DummyCommandableGoogleFunction().getHandler();