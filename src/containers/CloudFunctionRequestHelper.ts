/** @module containers */
import { Parameters } from 'pip-services3-commons-nodex';


/**
 * Class that helps to prepare function requests
 */
export class CloudFunctionRequestHelper {
    /**
     * Returns correlationId from Google Function request.
     * @param req the Google Function request
     * @return returns correlationId from request
     */
    public static getCorrelationId(req: any): string {
        let correlationId: string = req.correlation_id || "";
        try {
            if ((correlationId == null || correlationId == "") && req.hasOwnProperty('body')) {
                correlationId = req.body.correlation_id;
                if (correlationId == null || correlationId == "") {
                    correlationId = req.query.correlation_id;
                }
            }
        } catch (e) {
            // Ignore the error
        }
        return correlationId
    }

    /**
     * Returns command from Google Function request.
     * @param req the Google Function request
     * @return returns command from request
     */
    public static getCommand(req: any): string {
        let cmd: string = req.cmd || "";
        try {
            if ((cmd == null || cmd == "") && req.hasOwnProperty('body')) {
                cmd = req.body.cmd;
                if (cmd == null || cmd == "") {
                    cmd = req.query.cmd;
                }
            }
        } catch (e) {
            // Ignore the error
        }
        return cmd
    }

    /**
     * Returns body from Google Function request http request.
     * @param req the Google Function request
     * @return returns body from request
     */
    public static getParameters(req: any): Parameters {
        let body: any = req;
        try {
            if (req.hasOwnProperty('body')) {
                body = req.body;
            }
        } catch (e) {
            // Ignore the error
        }
        return Parameters.fromValue(body)
    }
}