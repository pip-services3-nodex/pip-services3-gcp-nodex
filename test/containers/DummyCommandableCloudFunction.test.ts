import { DummyCloudFunctionFixture } from './DummyCloudFunctionFixture';

suite('DummyCommandableCloudFunction', () => {

    let fixture: DummyCloudFunctionFixture;

    suiteSetup(async () => {
        fixture = new DummyCloudFunctionFixture('commandableHandler', 3003);
        await fixture.startCloudServiceLocally();
    });

    suiteTeardown(async () => {
        await fixture.stopCloudServiceLocally();
    });

    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

});
