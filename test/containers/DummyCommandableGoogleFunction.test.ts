import { DummyGoogleFunctionFixture } from './DummyGoogleFunctionFixture';

suite('DummyCommandableGoogleFunction', () => {

    let fixture: DummyGoogleFunctionFixture;

    suiteSetup(async () => {
        fixture = new DummyGoogleFunctionFixture('commandableHandler', 3003);
        await fixture.startCloudServiceLocally();
    });

    suiteTeardown(async () => {
        await fixture.stopCloudServiceLocally();
    });

    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

});
