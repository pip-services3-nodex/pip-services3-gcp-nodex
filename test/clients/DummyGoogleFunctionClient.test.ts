let process = require('process');

import { ConfigParams } from 'pip-services3-commons-nodex';
import { DummyClientFixture } from './DummyClientFixture';
import { DummyGoogleFunctionClient } from './DummyGoogleFunctionClient';

suite('DummyGoogleFunctionClient', ()=> {
    let functionName = process.env['GOOGLE_FUNCTION_NAME'];
    let protocol = process.env['GOOGLE_FUNCTION_PROTOCOL'];
    let region = process.env['GOOGLE_FUNCTION_REGION'];
    let projectId = process.env['GOOGLE_PROJECT_ID'];
    let uri = process.env['GOOGLE_FUNCTION_URI'] || 'http://localhost:3007';

    if (!uri && (!region || !functionName || !protocol || !projectId)) {
        return;
    }
    
    let config = ConfigParams.fromTuples(
        'connection.uri', uri,
        'connection.protocol', protocol,
        'connection.region', region,
        'connection.function_name', functionName,
        'credential.project_id', projectId,
    );

    let client: DummyGoogleFunctionClient;
    let fixture: DummyClientFixture;

    setup(async () => {
        client = new DummyGoogleFunctionClient();
        client.configure(config);

        fixture = new DummyClientFixture(client, 'handler', 3007);

        if (uri == 'http://localhost:3007')
            await fixture.startCloudServiceLocally();

        await client.open(null);
    });

    teardown(async () => {
        await client.close(null);

        if (uri == 'http://localhost:3007')
            await fixture.startCloudServiceLocally();
    });

    test('Crud Operations', async () => {
        await fixture.testCrudOperations();
    });

});