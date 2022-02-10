import { DummyCloudFunctionFixture } from './DummyCloudFunctionFixture';

suite('DummyCloudFunction', () => {

    let fixture: DummyCloudFunctionFixture;

    suiteSetup(async () => {
        fixture = new DummyCloudFunctionFixture('handler', 3002);
        await fixture.startCloudServiceLocally();
    });

    suiteTeardown(async () => {
        await fixture.stopCloudServiceLocally();
    });

    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

});
