import { IReferences } from 'pip-services3-commons-nodex';
import { CloudFunctionService } from '../../src/services/CloudFunctionService';
export declare class DummyCloudFunctionService extends CloudFunctionService {
    private _controller;
    private _headers;
    private numberOfCalls;
    constructor();
    setReferences(references: IReferences): void;
    private incrementNumberOfCalls;
    private getNumberOfCalls;
    private getPageByFilter;
    private getOneById;
    private create;
    private update;
    private deleteById;
    protected register(): void;
}
