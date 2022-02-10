import { DummyCloudFunctionFixture } from './DummyCloudFunctionFixture';

suite('DummyCommandableCloudFunctionService', () => {

    let fixture: DummyCloudFunctionFixture;

    suiteSetup(async () => {
        fixture = new DummyCloudFunctionFixture('commandableHandler', 3001);
        await fixture.startCloudServiceLocally();
    });

    suiteTeardown(async () => {
        await fixture.stopCloudServiceLocally();
    });

    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

});
