import { IReferences } from 'pip-services3-commons-nodex';
import { GoogleFunction } from '../../src/containers/GoogleFunction';
export declare class DummyGoogleFunction extends GoogleFunction {
    private _controller;
    constructor();
    setReferences(references: IReferences): void;
    private getPageByFilter;
    private getOneById;
    private create;
    private update;
    private deleteById;
    protected register(): void;
}
