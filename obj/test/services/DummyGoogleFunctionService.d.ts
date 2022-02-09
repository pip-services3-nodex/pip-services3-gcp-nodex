import { IReferences } from 'pip-services3-commons-nodex';
import { GoogleFunctionService } from '../../src/services/GoogleFunctionService';
export declare class DummyGoogleFunctionService extends GoogleFunctionService {
    private _controller;
    private _headers;
    constructor();
    setReferences(references: IReferences): void;
    private getPageByFilter;
    private getOneById;
    private create;
    private update;
    private deleteById;
    protected register(): void;
}
