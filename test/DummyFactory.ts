import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

import { DummyController } from './DummyController';
import { DummyGoogleFunctionService } from './services/DummyGoogleFunctionService';
import { DummyCommandableGoogleFunctionService } from './services/DummyCommandableGoogleFunctionService';

export class DummyFactory extends Factory {
	public static Descriptor = new Descriptor("pip-services-dummies", "factory", "default", "default", "1.0");
	public static ControllerDescriptor = new Descriptor("pip-services-dummies", "controller", "default", "*", "1.0");
	public static GoogleFunctionServiceDescriptor = new Descriptor("pip-services-dummies", "service", "google-function", "*", "1.0");
	public static CmdGoogleFunctionServiceDescriptor = new Descriptor("pip-services-dummies", "service", "commandable-google-function", "*", "1.0");
	public constructor() {
		super();
		this.registerAsType(DummyFactory.ControllerDescriptor, DummyController);
		this.registerAsType(DummyFactory.GoogleFunctionServiceDescriptor, DummyGoogleFunctionService);
		this.registerAsType(DummyFactory.CmdGoogleFunctionServiceDescriptor, DummyCommandableGoogleFunctionService);
	}
	
}
