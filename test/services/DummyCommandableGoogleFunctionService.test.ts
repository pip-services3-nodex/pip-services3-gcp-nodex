import { DummyGoogleFunctionFixture } from './DummyGoogleFunctionFixture';

suite('DummyCommandableGoogleFunctionService', () => {

    let fixture: DummyGoogleFunctionFixture;

    suiteSetup(async () => {
        fixture = new DummyGoogleFunctionFixture('commandableHandler', 3001);
        await fixture.startCloudServiceLocally();
    });

    suiteTeardown(async () => {
        await fixture.stopCloudServiceLocally();
    });

    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

});
