import { GoogleFunction } from '../../src/containers/GoogleFunction';
import { DummyFactory } from '../DummyFactory';

export class DummyGoogleFunction extends GoogleFunction {
    public constructor() {
        super("dummy", "Dummy lambda function");
        this._factories.add(new DummyFactory());
    }
}

export const handler = new DummyGoogleFunction().getHandler();