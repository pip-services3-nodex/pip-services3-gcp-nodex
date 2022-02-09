import { Descriptor } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams} from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { ObjectSchema } from 'pip-services3-commons-nodex';
import { TypeCode } from 'pip-services3-commons-nodex';
import { FilterParamsSchema } from 'pip-services3-commons-nodex';
import { PagingParamsSchema } from 'pip-services3-commons-nodex';

import { GoogleFunctionService } from '../../src/services/GoogleFunctionService';
import { IDummyController } from '../IDummyController';
import { DummySchema } from '../DummySchema';
import { GoogleFunctionRequestSchema } from '../GoogleFunctionRequestSchema';
import { HttpResponseSender } from 'pip-services3-rpc-nodex';

export class DummyGoogleFunctionService extends GoogleFunctionService {
    private _controller: IDummyController;
    private _headers = {
        'Content-Type': 'application/json'
    };

    public constructor() {
        super("dummies");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired<IDummyController>('controller');
    }

    private async getPageByFilter(req: any, res: any): Promise<any> {
        let params = req.body;
        const page = await this._controller.getPageByFilter(
            params.correlation_id,
            new FilterParams(params.filter),
            new PagingParams(params.paging)
        );
        
        res.set(this._headers);
        HttpResponseSender.sendResult(req, res, page)
    }

    private async getOneById(req: any, res: any): Promise<any> {
        let params = req.body;
        const dummy = await this._controller.getOneById(
            params.correlation_id,
            params.dummy_id
        );

        res.set(this._headers);
        if (dummy != null) {
            HttpResponseSender.sendResult(req, res, dummy);
        } else {
            HttpResponseSender.sendEmptyResult(req, res);
        }
        
    }

    private async create(req: any, res: any): Promise<any> {
        let params = req.body;
        const dummy = await this._controller.create(
            params.correlation_id,
            params.dummy
        );

        res.set(this._headers);
        HttpResponseSender.sendCreatedResult(req, res, dummy);
    }

    private async update(req: any, res: any): Promise<any> {
        let params = req.body;
        const dummy = await this._controller.update(
            params.correlation_id,
            params.dummy,
        );

        res.set(this._headers);
        HttpResponseSender.sendResult(req, res, dummy)
    }

    private async deleteById(req: any, res: any): Promise<any> {
        let params = req.body;
        const dummy = await this._controller.deleteById(
            params.correlation_id,
            params.dummy_id,
        );

        res.set(this._headers);
        HttpResponseSender.sendDeletedResult(req, res, dummy)
    }

    protected register() {
        this.registerAction(
            'get_dummies',
            new GoogleFunctionRequestSchema()
                .withOptionalProperty('body',
                    new ObjectSchema(true)
                        .withOptionalProperty("filter", new FilterParamsSchema())
                        .withOptionalProperty("paging", new PagingParamsSchema())
                )
            , this.getPageByFilter);

        this.registerAction(
            'get_dummy_by_id',
            new GoogleFunctionRequestSchema()
                .withOptionalProperty("body",
                    new ObjectSchema(true)
                        .withOptionalProperty("dummy_id", TypeCode.String)
                )
            , this.getOneById);

        this.registerAction(
            'create_dummy',
            new GoogleFunctionRequestSchema()
                .withOptionalProperty("body",
                    new ObjectSchema(true)
                        .withRequiredProperty("dummy", new DummySchema())
                )
            , this.create);

        this.registerAction(
            'update_dummy',
            new GoogleFunctionRequestSchema()
                .withOptionalProperty("body",
                    new ObjectSchema(true)
                        .withRequiredProperty("dummy", new DummySchema())
                )
            , this.update);

        this.registerAction(
            'delete_dummy',
            new GoogleFunctionRequestSchema()
                .withOptionalProperty("body",
                    new ObjectSchema(true)
                        .withOptionalProperty("dummy_id", TypeCode.String)
                )
            , this.deleteById);
    }
}
