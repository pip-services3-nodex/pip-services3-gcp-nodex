const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { GoogleConnectionParams } from '../../src/connect/GoogleConnectionParams';
import { GoogleConnectionResolver } from '../../src/connect/GoogleConnectionResolver';

suite('GoogleConnectionParams', ()=> {

    test('Test Empty Connection', async () => {
        let connection = new GoogleConnectionParams();
        assert.isNull(connection.getFunctionUri());
        assert.isNull(connection.getProjectId());
        assert.isNull(connection.getFunctionName());
        assert.isNull(connection.getRegion());
        assert.isNull(connection.getProtocol());
        assert.isNull(connection.getAuthToken());
    });

    test('Compose Config', async () => {
        const config1 = ConfigParams.fromTuples(
            'connection.uri', 'http://east-my_test_project.cloudfunctions.net/myfunction',
            'credential.auth_token', '1234',
        );
        const config2 = ConfigParams.fromTuples(
            'connection.protocol', 'http',
            'connection.region', 'east',
            'connection.function_name', 'myfunction',
            'credential.project_id', 'my_test_project',
            'credential.auth_token', '1234',
        );
        let resolver = new GoogleConnectionResolver();
        resolver.configure(config1);
        let connection =  await resolver.resolve('');

        assert.equal('http://east-my_test_project.cloudfunctions.net/myfunction', connection.getFunctionUri());
        assert.equal('east', connection.getRegion());
        assert.equal('http', connection.getProtocol());
        assert.equal('myfunction', connection.getFunctionName());
        assert.equal('my_test_project', connection.getProjectId());
        assert.equal('1234', connection.getAuthToken());

        resolver = new GoogleConnectionResolver();
        resolver.configure(config2);
        connection =  await resolver.resolve('');

        assert.equal('http://east-my_test_project.cloudfunctions.net/myfunction', connection.getFunctionUri());
        assert.equal('east', connection.getRegion());
        assert.equal('http', connection.getProtocol());
        assert.equal('myfunction', connection.getFunctionName());
        assert.equal('my_test_project', connection.getProjectId());
        assert.equal('1234', connection.getAuthToken());
    });
});