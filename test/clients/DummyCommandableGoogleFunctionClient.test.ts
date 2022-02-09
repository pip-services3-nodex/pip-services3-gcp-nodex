let process = require('process');

import { ConfigParams } from 'pip-services3-commons-nodex';
import { DummyClientFixture } from './DummyClientFixture';
import { DummyCommandableGoogleFunctionClient } from './DummyCommandableGoogleFunctionClient';

suite('DummyCommandableGoogleFunctionClient', ()=> {
    let functionName = process.env['GOOGLE_FUNCTION_NAME'];
    let protocol = process.env['GOOGLE_FUNCTION_PROTOCOL'];
    let region = process.env['GOOGLE_FUNCTION_REGION'];
    let projectId = process.env['GOOGLE_PROJECT_ID'];
    let uri = process.env['GOOGLE_FUNCTION_URI'] || 'http://localhost:3005';

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

    let client: DummyCommandableGoogleFunctionClient;
    let fixture: DummyClientFixture;

    setup(async () => {
        client = new DummyCommandableGoogleFunctionClient();
        client.configure(config);

        fixture = new DummyClientFixture(client, 'commandableHandler', 3005);

        if (uri == 'http://localhost:3005')
            await fixture.startCloudServiceLocally();
        
        await client.open(null);
    });

    teardown(async () => {
        await client.close(null);

        if (uri == 'http://localhost:3005') 
            await fixture.stopCloudServiceLocally();
        
    });

    test('Crud Operations', async () => {
        await fixture.testCrudOperations();
    });

});