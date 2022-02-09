import { DummyGoogleFunctionFixture } from './DummyGoogleFunctionFixture';

suite('DummyFunctionService', () => {

    let fixture: DummyGoogleFunctionFixture;

    suiteSetup(async () => {
        fixture = new DummyGoogleFunctionFixture('handler', 3000);
        await fixture.startCloudServiceLocally();
    });

    suiteTeardown(async () => {
        await fixture.stopCloudServiceLocally();
    });

    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

});
