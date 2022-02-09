import { DummyGoogleFunctionFixture } from './DummyGoogleFunctionFixture';

suite('DummyGoogleFunction', () => {

    let fixture: DummyGoogleFunctionFixture;

    suiteSetup(async () => {
        fixture = new DummyGoogleFunctionFixture('handler', 3002);
        await fixture.startCloudServiceLocally();
    });

    suiteTeardown(async () => {
        await fixture.stopCloudServiceLocally();
    });

    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

});
