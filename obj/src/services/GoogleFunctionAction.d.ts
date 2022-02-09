/** @module services */
import { Schema } from "pip-services3-commons-nodex";
import { Request, Response } from "express";
export declare class GoogleFunctionAction {
    /**
     * Command to call the action
     */
    cmd: string;
    /**
     * Schema to validate action parameters
     */
    schema: Schema;
    /**
     * Action to be executed
     */
    action: (req: Request, res: Response) => Promise<void>;
}
