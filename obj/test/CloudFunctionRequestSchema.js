"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudFunctionRequestSchema = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
class CloudFunctionRequestSchema extends pip_services3_commons_nodex_2.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('body', pip_services3_commons_nodex_1.TypeCode.Map);
        this.withOptionalProperty('query', pip_services3_commons_nodex_1.TypeCode.Map);
    }
}
exports.CloudFunctionRequestSchema = CloudFunctionRequestSchema;
//# sourceMappingURL=CloudFunctionRequestSchema.js.map